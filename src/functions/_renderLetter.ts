import { Settings, Letter } from '@/types'

export function renderLetter(
  letter: Letter,
  s_: number,
  w_: number,
  l_: number,
  angleSubtended: number,
  angleSubtendedByVowel: number,
  wordRadius: number,
  settings: Settings,
): any {
  let subletters = letter.subletters

  // There are five points in a letter to be aware of.
  // k0: The centre of the word relative to this letter. This is directly above
  // the midline of the letter.
  // k3: The leftmost point of the curve of this letter that sits on the word
  // circle.
  // k4: The rightmost point of this letter on the word circle. The combined
  // sweep from k3 to k4 for all letters in a word are what makes up the word
  // circle.
  // k1: If the letter intersects with the word, this is the leftmost
  // intersection.
  // k2: If the letter intersects with the word, this is the rightmost
  // intersection.
  const _ = [
    "R", // radius of word
    "r0.x", "r0.y", // center of letter
    "r", // radius of letter
    "k0.x", "k0.y", // centre of word
    "k1.x", "k1.y", // start of intersection
    "k2.x", "k2.y", // end of intersection
    "k3.x", "k3.y", // start of word segment
    "k4.x", "k4.y", // end of word segment
    "w", // radius of a vowel
    "v.y", "v.x", // centre of vowel (a letter can only have 1 vowel so ok)
  ]


  let N
  if(subletters[0].block == "buffer"){
    N = angleSubtended / 2
  } else {
    N = angleSubtended / 2
  }

  const k0 = {
    x: 0,
    y: 0,
  }

  const r = (
    (wordRadius * Math.cos(Math.PI / 2 - N))
    / (subletters[0].b! * Math.cos(Math.PI / 2 - N) + 1)
  )
  const w = (
    (wordRadius * Math.cos(Math.PI / 2 - angleSubtendedByVowel / 2))
    / 4
  )
  // w is one quarter of r for a standard letter, where b = 0.
  // The 'standard letter' here is the v block.

  const r0 = {
    x: k0.x + 0,
    y: k0.y + subletters[0].b! * r,
  }

  const v = {
    x: r0.x + 0,
    y: k0.y, // Placeholder for vert-dependent calculation
  }
  if (subletters[1].vert === -1) {
    v.y = k0.y - 2 * w
  } else if (subletters[1].vert === 0) {
    if (["s", "p"].includes(subletters[0].block)) {
      v.y = r0.y
    } else if (["d", "f", "v"].includes(subletters[0].block)) {
      v.y = k0.y
    }
  } else if (subletters[1].vert === 1) {
    if (["s", "p", "d", "f"].includes(subletters[0].block)) {
      v.y = r0.y + r
    } else if (["v"].includes(subletters[0].block)) {
      v.y = k0.y + 2 * w
    }
  }

  const R = {
    x: 0,
    y: wordRadius,
  }

  const k1 = {
    x: circleIntersectionPoints(R.x, R.y, wordRadius, r0.x, r0.y, r)[1],
    y: circleIntersectionPoints(R.x, R.y, wordRadius, r0.x, r0.y, r)[3],
  }

  const k2 = {
    x: circleIntersectionPoints(R.x, R.y, wordRadius, r0.x, r0.y, r)[0],
    y: circleIntersectionPoints(R.x, R.y, wordRadius, r0.x, r0.y, r)[2],
  }

  const k3 = {
    x: R.x + (k0.x - R.x) * Math.cos(-N) - (k0.y - R.y) * Math.sin(-N),
    y: R.y + (k0.x - R.x) * Math.sin(-N) + (k0.y - R.y) * Math.cos(-N),
  }

  const k4 = {
    x: R.x + (k0.x - R.x) * Math.cos(N) - (k0.y - R.y) * Math.sin(N),
    y: R.y + (k0.x - R.x) * Math.sin(N) + (k0.y - R.y) * Math.cos(N),
  }

  const path: string[] = []

  // Always start from the first part of this letter's segment of the word
  // circle line.
  path.push(`M ${k3.x} ${k3.y}`)

  if (["s", "p", "d", "f"].includes(subletters[0].block)) {
    // Start with non-vowel, non-buffer blocks
    // A letter that is 'full' has a complete circle, regardless of whether or
    // not it intersects with the word.
    if (subletters[0].full) {
      // Draw uninterrupted word segment
      path.push(`A ${wordRadius} ${wordRadius} 0 0 1 ${k4.x} ${k4.y}`)
      // Jump to letter circle and draw it in two arcs (XXX why two?)
      path.push(`M ${r0.x} ${r0.y}`)
      path.push(`m -${r} 0`)
      path.push(`a ${r} ${r} 0 1 1 ${2 * r} 0`)
      path.push(`a ${r} ${r} 0 1 1 ${-2 * r} 0`)
      // Jump back to end of word segment and declare finished
      path.push(`M ${k4.x} ${k4.y}`)
    } else {
      // Draw word segment until intersection
      path.push(`A ${wordRadius} ${wordRadius} 0 0 1 ${k1.x} ${k1.y}`)
      // Draw along letter curve until next intersection
      if (subletters[0].block == "s") {
        // Select the correct arc to draw
        // TODO determine this programmatically, not by block
        path.push(`A ${r} ${r} 0 1 0 ${k2.x} ${k2.y}`)
      } else {
        path.push(`A ${r} ${r} 0 0 0 ${k2.x} ${k2.y}`)
      }
      // Draw remainder of word segment and declare finished
      path.push(`A ${wordRadius} ${wordRadius} 0 0 1 ${k4.x} ${k4.y}`)
    }
    // Draw any vowels
    if(subletters.length == 2){
      // Jump to the vowel and draw its circle
      path.push(`M ${v.x} ${v.y}`)
      path.push(`m -${w} 0`)
      path.push(`a ${w} ${w} 0 1 1 2${w} 0`)
      path.push(`a ${w} ${w} 0 1 1 -2${w} 0`)
      // Jump back to end of word segment and declare finished
      path.push(`M ${k4.x} ${k4.y}`)
    }
  } else if (subletters[0].block === `buffer`) {
    // Draw the buffer, which is just an empty word segment
    path.push(`A ${wordRadius} ${wordRadius} 0 0 1 ${k4.x} ${k4.y}`)
  } else if (subletters[0].block === "v") {
    // Draw the uninterrupted word segment
    path.push(`A ${wordRadius} ${wordRadius} 0 0 1 ${k4.x} ${k4.y}`)
    // Jump to the vowel and draw its circle
    path.push(`M ${v.x} ${v.y}`)
    path.push(`m -${w} 0`)
    path.push(`a ${w} ${w} 0 1 1 ${2 * w} 0`)
    path.push(`a ${w} ${w} 0 1 1 ${-2 * w} 0`)
    // Jump back to end of word segment and declare finished
    path.push(`M ${k4.x} ${k4.y}`)
  }

  // bundle path into tempArray
  subletters[0].path = path.join(" ")
  // woah tempArray I bet you were NOT expecting that
}

function circleIntersectionPoints(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number,
): number[] {
  /**
   * Calculates the points of intersection of two circles given their
   * coordinates and radii.
   * @param x0: x-coordinate of the first circle.
   * @param y0: y-coordinate of the first circle.
   * @param r0: Radius of the first circle.
   * @param x0: x-coordinate of the second circle.
   * @param y0: y-coordinate of the second circle.
   * @param r0: Radius of the second circle.
   * @returns [x, x, y, y] for the two points of intersection.
   */
  const dx = x1 - x0
  const dy = y1 - y0
  const d = Math.hypot(dy, dx)
  const a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d)
  const x2 = x0 + (dx * a / d)
  const y2 = y0 + (dy * a / d)
  const h = Math.sqrt((r0 * r0) - (a * a))
  const rx = -dy * (h / d)
  const ry = dx * (h / d)
  const xi = x2 + rx
  const xi_prime = x2 - rx
  const yi = y2 + ry
  const yi_prime = y2 - ry
  return [xi, xi_prime, yi, yi_prime] // xi is positive, xi_prime is negative for the word-letter situation
}
