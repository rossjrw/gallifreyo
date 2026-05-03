import type { Sentence } from "../classes/Sentence"
import type { Word } from "../classes/Word"
import type { Letter } from "../classes/Letter"
import { Bay, InterlockCandidate } from "../types/phrases"
import { fixBoundingBox } from "../functions/box"

const ALPHA_MIN = 2 * Math.asin(0.1)  // ≈ 0.2 rad — letter cannot be a sliver
const ALPHA_MAX = Math.PI              // letter cannot subtend more than half the word
const MAX_ITER = 300
const CONVERGENCE_DELTA = 0.5
const STEP = 0.15

function normaliseAngle (a: number): number {
  while (a > Math.PI) a -= 2 * Math.PI
  while (a < -Math.PI) a += 2 * Math.PI
  return a
}

function clamp (v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function firstNonBufferAngularSize (word: Word): number {
  const letter = word.phrases.find(l => l.subletters[0].block !== "buffer")
  return letter?.subletters[0].absoluteAngularSize ?? (2 * Math.PI)
}

function getBays (word: Word): Bay[] {
  const bays: Bay[] = []
  for (const letter of word.phrases) {
    if (letter.subletters[0].block !== "d") continue
    // Vowels other than O (vert=1) occupy the concave bay and block docking
    if (letter.subletters[1] !== undefined && letter.subletters[1].vert !== 1) continue
    if (!letter.letterCentre || letter.letterRadius === undefined) continue
    bays.push({
      ownerWord: word,
      letter,
      centre: letter.letterCentre,
      radius: letter.letterRadius,
      worldAngle: letter.angularLocation!,
    })
  }
  return bays
}

function computeBlockerClearanceRotation (B: Word, A: Word, alphaReq: number): number {
  const directionToA = Math.atan2(A.x - B.x, -(A.y - B.y))

  const blockers = B.phrases.filter(letter => {
    const block = letter.subletters[0].block
    const isConvex = block === "f" || block === "s" ||
      (letter.subletters.length > 1 && letter.subletters[1].vert === -1)
    if (!isConvex) return false
    const halfSector = alphaReq / 2 + (letter.subletters[0].absoluteAngularSize ?? 0) / 2
    return Math.abs(normaliseAngle(letter.angularLocation! - directionToA)) < halfSector
  })

  if (blockers.length === 0) return 0

  let cwNeeded = false
  let ccwNeeded = false
  let maxCwRot = 0
  let maxCcwRot = 0

  for (const blocker of blockers) {
    const letterAngle = blocker.angularLocation!
    const halfLetterSize = (blocker.subletters[0].absoluteAngularSize ?? 0) / 2
    const sectorStart = directionToA - alphaReq / 2
    const sectorEnd = directionToA + alphaReq / 2

    const angDistFromCentre = normaliseAngle(letterAngle - directionToA)
    if (angDistFromCentre > 0) {
      // Blocker is clockwise of centre — rotate CCW to clear
      const rotNeeded = Math.abs(letterAngle - halfLetterSize - sectorEnd)
      ccwNeeded = true
      maxCcwRot = Math.max(maxCcwRot, rotNeeded)
    } else {
      // Blocker is counterclockwise of centre — rotate CW to clear
      const rotNeeded = Math.abs(sectorStart - (letterAngle + halfLetterSize))
      cwNeeded = true
      maxCwRot = Math.max(maxCwRot, rotNeeded)
    }
  }

  if (cwNeeded && ccwNeeded) return NaN

  const maxRot = firstNonBufferAngularSize(B) / 2
  if (ccwNeeded) {
    if (maxCcwRot > maxRot) return NaN
    return -maxCcwRot
  }
  if (maxCwRot > maxRot) return NaN
  return maxCwRot
}

function canClearConvexBlockers (B: Word, A: Word, alphaReq: number): boolean {
  return !isNaN(computeBlockerClearanceRotation(B, A, alphaReq))
}

function detectCandidates (sentence: Sentence, g: number): InterlockCandidate[] {
  const rawCandidates: InterlockCandidate[] = []
  const words = sentence.phrases.filter(p => p.depth === "word") as Word[]

  for (const wordA of words) {
    for (const bay of getBays(wordA)) {
      for (const wordB of words) {
        if (wordB === wordA) continue

        // Only consider angularly adjacent words — prevents distant words leaping across
        const angSep = Math.abs(normaliseAngle(
          (wordB.angularLocation ?? 0) - (wordA.angularLocation ?? 0),
        ))
        const adjThreshold = (
          (wordA.absoluteAngularSize ?? 0) + (wordB.absoluteAngularSize ?? 0)
        ) * 0.75
        if (angSep > adjThreshold) continue

        const directionToB = Math.atan2(wordB.x - wordA.x, -(wordB.y - wordA.y))
        const angularDiff = normaliseAngle(directionToB - bay.worldAngle)
        if (Math.abs(angularDiff) > Math.PI / 2) continue

        const rL = wordB.radius + g
        const alphaReq = 2 * Math.asin(rL / (wordA.radius + 0.4 * rL))
        if (isNaN(alphaReq) || alphaReq < ALPHA_MIN || alphaReq > ALPHA_MAX) continue

        if (canClearConvexBlockers(wordB, wordA, alphaReq)) {
          rawCandidates.push({ wordA, bay, wordB })
        }
      }
    }
  }

  // One word per bay: keep only the wordB currently closest to the bay centre
  const byBay = new Map<Letter, InterlockCandidate>()
  for (const c of rawCandidates) {
    const key = c.bay.letter
    const existing = byBay.get(key)
    if (!existing) {
      byBay.set(key, c)
    } else {
      const dExisting = Math.hypot(
        existing.wordB.x - c.bay.centre.x,
        existing.wordB.y - c.bay.centre.y,
      )
      const dNew = Math.hypot(
        c.wordB.x - c.bay.centre.x,
        c.wordB.y - c.bay.centre.y,
      )
      if (dNew < dExisting) byBay.set(key, c)
    }
  }

  return Array.from(byBay.values())
}

// Placeholder — non-interlocked words remain in their initial radial positions for Phase 1
function rebalanceOtherWords (_sentence: Sentence, _candidates: InterlockCandidate[]): void {
  // TODO Phase 1: implement radial rebalancing so vacated space fills in
}

export function solveInterlocking (
  sentence: Sentence,
  g: number,
  onConverge: () => void,
): void {
  function step (iter: number): void {
    if (iter >= MAX_ITER) { onConverge(); return }

    const candidates = detectCandidates(sentence, g)
    if (candidates.length === 0) { onConverge(); return }

    let maxChange = 0

    for (const { wordA: A, bay, wordB: B } of candidates) {
      const rL = B.radius + g
      const alphaReq = 2 * Math.asin(rL / (A.radius + 0.4 * rL))
      if (isNaN(alphaReq) || alphaReq < ALPHA_MIN || alphaReq > ALPHA_MAX) continue

      // Target centre for word B
      const dir = { x: Math.sin(bay.worldAngle), y: -Math.cos(bay.worldAngle) }
      const rLTarget = B.radius + g
      const targetCentre = {
        x: A.x + (A.radius + 0.4 * rLTarget) * dir.x,
        y: A.y + (A.radius + 0.4 * rLTarget) * dir.y,
      }

      // 1. Adjust d-block letter's relative angular size toward alphaReq
      const currentRelSize = bay.letter.relativeAngularSizeOverride
        ?? bay.letter.subletters[0].relativeAngularSize!
      const relativeSum = A.phrases.reduce(
        (s, l) => s + (l.relativeAngularSizeOverride ?? l.subletters[0].relativeAngularSize!), 0,
      )
      const targetRelSize = alphaReq * relativeSum / (2 * Math.PI)
      const deltaRel = (targetRelSize - currentRelSize) * STEP
      bay.letter.relativeAngularSizeOverride = currentRelSize + deltaRel
      maxChange = Math.max(maxChange, Math.abs(deltaRel))

      // 2. Move B toward target centre
      const deltaX = (targetCentre.x - B.x) * STEP
      const deltaY = (targetCentre.y - B.y) * STEP
      B.x += deltaX
      B.y += deltaY
      maxChange = Math.max(maxChange, Math.hypot(deltaX, deltaY))

      // 3. Adjust B.radius toward r_L - g
      const newRL = A.radius * Math.sin(alphaReq / 2) / (1 - 0.4 * Math.sin(alphaReq / 2))
      const deltaR = (newRL - g - B.radius) * STEP
      B.radius += deltaR
      maxChange = Math.max(maxChange, Math.abs(deltaR))

      // 4. Rotate word A to orient bay toward B
      const actualAngle = Math.atan2(B.x - A.x, -(B.y - A.y))
      const angleErrA = normaliseAngle(actualAngle - bay.worldAngle)
      const maxRotA = firstNonBufferAngularSize(A) / 2
      A.rotationOffset = clamp(A.rotationOffset + angleErrA * STEP, -maxRotA, maxRotA)
      maxChange = Math.max(maxChange, Math.abs(angleErrA * STEP))

      // 5. Rotate word B to clear convex-side blockers
      const blockerRot = computeBlockerClearanceRotation(B, A, alphaReq)
      if (!isNaN(blockerRot)) {
        const maxRotB = firstNonBufferAngularSize(B) / 2
        B.rotationOffset = clamp(B.rotationOffset + blockerRot * STEP, -maxRotB, maxRotB)
        maxChange = Math.max(maxChange, Math.abs(blockerRot * STEP))
      }
    }

    rebalanceOtherWords(sentence, candidates)

    // Recompute geometry for all words after position/size adjustments
    sentence.phrases.forEach(p => {
      if (p.depth === "word") (p as Word).computeGeometry()
    })

    sentence.clearPaths()
    sentence.generatePaths()
    fixBoundingBox()

    if (maxChange < CONVERGENCE_DELTA) { onConverge(); return }
    requestAnimationFrame(() => step(iter + 1))
  }

  requestAnimationFrame(() => step(0))
}
