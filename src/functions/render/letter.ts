import { Word, Letter } from '@/types/phrases'

export function renderLetter(
  word: Word,
  letter: Letter,
  angleSubtendedByVowel: number,
  wordRadius: number,
): void {
  /**
   * Generates the SVG path for a given letter and attaches it as letter.d.
   *
   * @param word: The word that contains this letter.
   * @param letter: The letter to be rendered.
   * @param angleSubtendedByVowel: The absolute angle to be subtended by a
   * vowel for this word.
   * @param wordRadius: The radius of the word.
   * @returns void; letter retains path information.
   */
  letter.paths = []

  const angleSubtended = letter.subletters[0].absoluteAngularSize!

  const subletters = letter.subletters

  // The centre of the word, i.e. the top of the letter
  const wordCentre = {
    x: word.x!,
    y: word.y!,
  }

  // Base of letter, a point on the word circle
  // Should be directly below the centre of the word, and this letter will be
  // rotated to the correct angle afterwards
  const letterBase = {
    x: wordCentre.x,
    y: wordCentre.y - wordRadius,
  }

  // The radius of the consonant circle
  const letterRadius = (
    (wordRadius * Math.sin(angleSubtended / 2))
    / (subletters[0].height! * Math.sin(angleSubtended / 2) + 1)
  )
  const vowelRadius = (
    (wordRadius * Math.sin(angleSubtendedByVowel / 2))
    / 4
  )
  // vowelRadius is one quarter of letterRadius for a standard letter,
  // where b = 0. The 'standard letter' here is the v block.

  // The centre of the consonant circle
  const letterCentre = {
    x: letterBase.x,
    y: letterBase.y + subletters[0].height! * letterRadius,
  }

  // The centre of a vowel on this letter
  const vowelCentre = {
    x: letterCentre.x,
    y: letterBase.y, // Placeholder for vert-dependent calculation
  }
  if (subletters.length > 1) {
    if (subletters[1].vert === -1) {
      vowelCentre.y = letterBase.y - 2 * vowelRadius
    } else if (subletters[1].vert === 0) {
      if (["s", "p"].includes(subletters[0].block)) {
        vowelCentre.y = letterCentre.y
      } else if (["d", "f", "v"].includes(subletters[0].block)) {
        vowelCentre.y = letterBase.y
      }
    } else if (subletters[1].vert === 1) {
      if (["s", "p", "d", "f"].includes(subletters[0].block)) {
        vowelCentre.y = letterCentre.y + letterRadius
      } else if (["v"].includes(subletters[0].block)) {
        vowelCentre.y = letterBase.y + 2 * vowelRadius
      }
    }
  }

  // The first point at which the word line intersects with the consonant
  // circle, or NaN if it does not.
  const letterStart = {
    x: circleIntersectionPoints(
      wordCentre.x, wordCentre.y, wordRadius,
      letterCentre.x, letterCentre.y, letterRadius
    )[1],
    y: circleIntersectionPoints(
      wordCentre.x, wordCentre.y, wordRadius,
      letterCentre.x, letterCentre.y, letterRadius
    )[3],
  }

  // The second point at which the word line intersects with the consonant
  // circle, or NaN if it does not.
  const letterEnd = {
    x: circleIntersectionPoints(
      wordCentre.x, wordCentre.y, wordRadius,
      letterCentre.x, letterCentre.y, letterRadius
    )[0],
    y: circleIntersectionPoints(
      wordCentre.x, wordCentre.y, wordRadius,
      letterCentre.x, letterCentre.y, letterRadius
    )[2],
  }

  // The start of this segment of the word line, where this letter connects to
  // the previous one.
  const wordStart = {
    x: (wordCentre.x +
        (letterBase.x - wordCentre.x) * Math.cos(-angleSubtended / 2) -
        (letterBase.y - wordCentre.y) * Math.sin(-angleSubtended / 2)
       ),
    y: (wordCentre.y +
        (letterBase.x - wordCentre.x) * Math.sin(-angleSubtended / 2) +
        (letterBase.y - wordCentre.y) * Math.cos(-angleSubtended / 2)
       ),
  }

  // The end of this segment of the word line, where this letter connects to
  // the next one.
  const wordEnd = {
    x: (wordCentre.x +
        (letterBase.x - wordCentre.x) * Math.cos(angleSubtended / 2) -
        (letterBase.y - wordCentre.y) * Math.sin(angleSubtended / 2)
       ),
    y: (wordCentre.y +
        (letterBase.x - wordCentre.x) * Math.sin(angleSubtended / 2) +
        (letterBase.y - wordCentre.y) * Math.cos(angleSubtended / 2)
       ),
  }

  // Always start from the first part of this letter's segment of the word
  // circle line.
  let path = `M ${wordStart.x} ${wordStart.y}`

  if (["s", "p", "d", "f"].includes(subletters[0].block)) {
    // Start with non-vowel, non-buffer blocks
    // A letter that is 'full' has a complete circle, regardless of whether or
    // not it intersects with the word.
    if (subletters[0].full) {
      // Draw uninterrupted word segment
      path += `A ${wordRadius} ${wordRadius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
      // Jump to letter circle and draw it
      path += `M ${letterCentre.x} ${letterCentre.y}`
      path += `m -${letterRadius} 0`
      path += `a ${letterRadius} ${letterRadius} 0 1 1 ${2 * letterRadius} 0`
      path += `a ${letterRadius} ${letterRadius} 0 1 1 ${-2 * letterRadius} 0`
      // Jump back to end of word segment and declare finished
      path += `M ${wordEnd.x} ${wordEnd.y}`
    } else {
      // Draw word segment until intersection
      path += `A ${wordRadius} ${wordRadius} 0 0 1 ${letterStart.x} ${letterStart.y}`
      // Draw along letter curve until next intersection
      if (subletters[0].block == "s") {
        // Select the correct arc to draw
        // TODO determine this programmatically, not by block
        path += `A ${letterRadius} ${letterRadius} 0 1 0 ${letterEnd.x} ${letterEnd.y}`
      } else {
        path += `A ${letterRadius} ${letterRadius} 0 0 0 ${letterEnd.x} ${letterEnd.y}`
      }
      // Draw remainder of word segment and declare finished
      path += `A ${wordRadius} ${wordRadius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
    }
    // Draw any vowels
    if(subletters.length == 2){
      // Jump to the vowel and draw its circle
      path += `M ${vowelCentre.x} ${vowelCentre.y}`
      path += `m -${vowelRadius} 0`
      path += `a ${vowelRadius} ${vowelRadius} 0 1 1 ${2 * vowelRadius} 0`
      path += `a ${vowelRadius} ${vowelRadius} 0 1 1 ${-2 * vowelRadius} 0`
      // Jump back to end of word segment and declare finished
      path += `M ${wordEnd.x} ${wordEnd.y}`

      const vowelDebugPath = `M ${wordCentre.x} ${wordCentre.y} L ${vowelCentre.x} ${vowelCentre.y} l -${vowelRadius} 0 l ${2 * vowelRadius} 0`
      letter.paths.push({
        d: vowelDebugPath,
        type: 'debug',
        purpose: 'position',
      })
    }
  } else if (subletters[0].block === `buffer`) {
    // Draw the buffer, which is just an empty word segment
    path += `A ${wordRadius} ${wordRadius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
  } else if (subletters[0].block === "v") {
    // Draw the uninterrupted word segment
    path += `A ${wordRadius} ${wordRadius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
    // Jump to the vowel and draw its circle
    path += `M ${vowelCentre.x} ${vowelCentre.y}`
    path += `m -${vowelRadius} 0`
    path += `a ${vowelRadius} ${vowelRadius} 0 1 1 ${2 * vowelRadius} 0`
    path += `a ${vowelRadius} ${vowelRadius} 0 1 1 ${-2 * vowelRadius} 0`
    // Jump back to end of word segment and declare finished
    path += `M ${wordEnd.x} ${wordEnd.y}`

    const vowelDebugPath = `M ${wordCentre.x} ${wordCentre.y} L ${vowelCentre.x} ${vowelCentre.y} l -${vowelRadius} 0 l ${2 * vowelRadius} 0`
    letter.paths.push({
      d: vowelDebugPath,
      type: 'debug',
      purpose: 'position',
    })
  }

  letter.paths.push({d: path, type: 'default'})

  const consonantDebugPath = `M ${wordCentre.x} ${wordCentre.y} L ${wordStart.x} ${wordStart.y}`
  letter.paths.push({
    d: consonantDebugPath,
    type: 'debug',
    purpose: 'angle',
  })

  // Make a debug path to show the percieved size of the word
  let wordCircleDebugPath = ""
  wordCircleDebugPath += `M ${wordStart.x} ${wordStart.y}`
  wordCircleDebugPath += `A ${word.radius} ${word.radius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
  letter.paths.push({
    d: wordCircleDebugPath,
    type: 'debug',
    purpose: 'circle',
  })
}

export function circleIntersectionPoints(
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
  return [xi, xi_prime, yi, yi_prime]
  // xi is positive, xi_prime is negative for the word-letter situation
}
