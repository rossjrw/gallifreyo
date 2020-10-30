import { Settings } from '@/types/state'
import { Text } from '@/classes/Phrase'
import { Word } from '@/classes/Word'
import { Subletter } from '@/types/phrases'
import { circleIntersectionPoints } from '@/functions/geometry'

export class Letter extends Text {
  depth: "letter"
  subletters: Subletter[]
  // Render properties
  height?: number
  // Drawing properties
  transform?: string

  constructor (id: number, settings: Settings, subletters: Subletter[]) {
    super(id, settings)
    this.depth = 'letter'
    this.subletters = subletters
  }

  render (word: Word, angleSubtendedByVowel: number): void {
    /**
     * Generates the SVG path for a given letter and attaches it as letter.d.
     *
     * @param word: The word that contains this letter.
     * @param angleSubtendedByVowel: The absolute angle to be subtended by a
     * vowel for this word.
     * @returns void; letter retains path information.
     */
    const subletters = this.subletters

    this.paths = []

    // The width of this letter as an angle
    const angleSubtended = subletters[0].absoluteAngularSize!

    // The angle of this letter relative to the word
    const angle = this.angularLocation!

    // The centre of the word, i.e. the top of the letter
    const wordCentre = {
      x: word.x!,
      y: word.y!,
    }

    // Base of letter, a point on the word circle
    const letterBase = {
      x: wordCentre.x + word.radius! * Math.sin(angle),
      y: wordCentre.y - word.radius! * Math.cos(angle),
    }

    // The radius of the consonant circle
    const letterRadius = (
      (word.radius! * Math.sin(angleSubtended / 2))
      / (subletters[0].height! * Math.sin(angleSubtended / 2) + 1)
    )
    const vowelRadius = (
      (word.radius! * Math.sin(angleSubtendedByVowel / 2))
      / 4
    )
    // vowelRadius is one quarter of letterRadius for a standard letter,
    // where b = 0. The 'standard letter' here is the v block.

    // The centre of the consonant circle
    const letterCentre = {
      x: letterBase.x - subletters[0].height! * letterRadius * Math.sin(angle),
      y: letterBase.y + subletters[0].height! * letterRadius * Math.cos(angle),
    }

    // Distance of the vowel from the centre of the letter, along the same angle
    let vowelStart = letterBase
    let vowelDistance = 0
    if (subletters.length > 1) {
      if (subletters[1].vert === -1) {
        vowelDistance = -2 * vowelRadius
      } else if (subletters[1].vert === 0) {
        if (["s", "p"].includes(subletters[0].block)) {
          vowelStart = letterCentre
          vowelDistance = 0
        } else if (["d", "f", "v"].includes(subletters[0].block)) {
          vowelDistance = 0
        }
      } else if (subletters[1].vert === 1) {
        vowelStart = letterCentre
        vowelDistance = letterRadius
      }
    }

    // The centre of a vowel on this letter
    const vowelCentre = {
      x: vowelStart.x - vowelDistance * Math.sin(angle),
      y: vowelStart.y + vowelDistance * Math.cos(angle),
    }

    // The first point at which the word line intersects with the consonant
    // circle, or NaN if it does not.
    const letterStart = {
      x: circleIntersectionPoints(
        wordCentre.x, wordCentre.y, word.radius!,
        letterCentre.x, letterCentre.y, letterRadius
      )[1],
      y: circleIntersectionPoints(
        wordCentre.x, wordCentre.y, word.radius!,
        letterCentre.x, letterCentre.y, letterRadius
      )[3],
    }

    // The second point at which the word line intersects with the consonant
    // circle, or NaN if it does not.
    const letterEnd = {
      x: circleIntersectionPoints(
        wordCentre.x, wordCentre.y, word.radius!,
        letterCentre.x, letterCentre.y, letterRadius
      )[0],
      y: circleIntersectionPoints(
        wordCentre.x, wordCentre.y, word.radius!,
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
        path += `A ${word.radius} ${word.radius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
        // Jump to letter circle and draw it
        path += `M ${letterCentre.x} ${letterCentre.y}`
        path += `m -${letterRadius} 0`
        path += `a ${letterRadius} ${letterRadius} 0 1 1 ${2 * letterRadius} 0`
        path += `a ${letterRadius} ${letterRadius} 0 1 1 ${-2 * letterRadius} 0`
        // Jump back to end of word segment and declare finished
        path += `M ${wordEnd.x} ${wordEnd.y}`
      } else {
        // Draw word segment until intersection
        path += `A ${word.radius} ${word.radius} 0 0 1 ${letterStart.x} ${letterStart.y}`
        // Draw along letter curve until next intersection
        if (subletters[0].block == "s") {
          // Select the correct arc to draw
          // TODO determine this programmatically, not by block
          path += `A ${letterRadius} ${letterRadius} 0 1 0 ${letterEnd.x} ${letterEnd.y}`
        } else {
          path += `A ${letterRadius} ${letterRadius} 0 0 0 ${letterEnd.x} ${letterEnd.y}`
        }
        // Draw remainder of word segment and declare finished
        path += `A ${word.radius} ${word.radius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
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
        this.paths.push({
          d: vowelDebugPath,
          type: 'debug',
          purpose: 'position',
        })
      }
    } else if (subletters[0].block === `buffer`) {
      // Draw the buffer, which is just an empty word segment
      path += `A ${word.radius} ${word.radius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
    } else if (subletters[0].block === "v") {
      // Draw the uninterrupted word segment
      path += `A ${word.radius} ${word.radius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
      // Jump to the vowel and draw its circle
      path += `M ${vowelCentre.x} ${vowelCentre.y}`
      path += `m -${vowelRadius} 0`
      path += `a ${vowelRadius} ${vowelRadius} 0 1 1 ${2 * vowelRadius} 0`
      path += `a ${vowelRadius} ${vowelRadius} 0 1 1 ${-2 * vowelRadius} 0`
      // Jump back to end of word segment and declare finished
      path += `M ${wordEnd.x} ${wordEnd.y}`

      const vowelDebugPath = `M ${wordCentre.x} ${wordCentre.y} L ${vowelCentre.x} ${vowelCentre.y} l -${vowelRadius} 0 l ${2 * vowelRadius} 0`
      this.paths.push({
        d: vowelDebugPath,
        type: 'debug',
        purpose: 'position',
      })
    }

    this.paths.push({d: path, type: 'default'})

    const consonantDebugPath = `M ${wordCentre.x} ${wordCentre.y} L ${wordStart.x} ${wordStart.y}`
    this.paths.push({
      d: consonantDebugPath,
      type: 'debug',
      purpose: 'angle',
    })

    // Make a debug path to show the percieved size of the word
    let wordCircleDebugPath = ""
    wordCircleDebugPath += `M ${wordStart.x} ${wordStart.y}`
    wordCircleDebugPath += `A ${word.radius} ${word.radius} 0 0 1 ${wordEnd.x} ${wordEnd.y}`
    this.paths.push({
      d: wordCircleDebugPath,
      type: 'debug',
      purpose: 'circle',
    })
  }

  addAngularLocation (word: Word, index: number): void {
    /**
     * Set the angular location of this letter based on its position in the
     * word.
     *
     * @param word: The word that contains this letter.
     * @param index: The index of this letter in the word.
     */
    this.angularLocation = (
      word.phrases.slice(0, index + 1).reduce((total, letter) => {
        return total + letter.subletters[0].absoluteAngularSize!
      }, 0)
      - (word.phrases[0].subletters[0].absoluteAngularSize! / 2)
      - (word.phrases[index].subletters[0].absoluteAngularSize! / 2)
    )
  }
}
