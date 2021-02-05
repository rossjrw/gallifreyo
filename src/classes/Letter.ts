import { sum } from "lodash"

import { Settings } from "../types/state"
import { TextNode } from "../classes/Phrase"
import { Word } from "../classes/Word"
import { Subletter, Dot } from "../types/phrases"
import { circleIntersectionPoints } from "../functions/geometry"

export class Letter extends TextNode {
  depth: "letter"
  subletters: Subletter[]
  // Render properties
  height?: number
  dots?: Dot[]
  // Drawing properties
  transform?: string

  constructor (id: number, settings: Settings, subletters: Subletter[]) {
    super(id, settings)
    this.depth = "letter"
    this.subletters = subletters
  }

  /**
   * Generates the SVG path for a given letter and attaches it as letter.d.
   *
   * @param word - The word that contains this letter.
   * @param angleSubtendedByVowel - The absolute angle to be subtended by a
   * vowel for this word.
   * @returns void; letter retains path information.
   */
  draw (word: Word, angleSubtendedByVowel: number): void {
    const subletters = this.subletters

    // The width of this letter as an angle
    const angleSubtended = subletters[0].absoluteAngularSize!

    // The angle of this letter relative to the word
    const angle = this.angularLocation!

    // The centre of the word, i.e. the top of the letter
    const wordCentre = {
      x: word.x,
      y: word.y,
    }

    // Base of letter, a point on the word circle
    const letterBase = {
      x: wordCentre.x + word.radius * Math.sin(angle),
      y: wordCentre.y - word.radius * Math.cos(angle),
    }

    // The radius of the consonant circle
    const letterRadius = (
      (word.radius * Math.sin(angleSubtended / 2)) /
      (subletters[0].height! * Math.sin(angleSubtended / 2) + 1)
    )
    const vowelRadius = (
      (word.radius * Math.sin(angleSubtendedByVowel / 2)) /
      4
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
        } else if (["f", "v"].includes(subletters[0].block)) {
          vowelDistance = 0
        } else if (subletters[0].block === "d") {
          // Nudge a centred vowel just inside the radius - it is ambiguous
          // with a vert=1 vowel otherwise
          vowelDistance = vowelRadius
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
        wordCentre.x, wordCentre.y, word.radius,
        letterCentre.x, letterCentre.y, letterRadius,
      )[1],
      y: circleIntersectionPoints(
        wordCentre.x, wordCentre.y, word.radius,
        letterCentre.x, letterCentre.y, letterRadius,
      )[3],
    }

    // The second point at which the word line intersects with the consonant
    // circle, or NaN if it does not.
    const letterEnd = {
      x: circleIntersectionPoints(
        wordCentre.x, wordCentre.y, word.radius,
        letterCentre.x, letterCentre.y, letterRadius,
      )[0],
      y: circleIntersectionPoints(
        wordCentre.x, wordCentre.y, word.radius,
        letterCentre.x, letterCentre.y, letterRadius,
      )[2],
    }

    // The start of this segment of the word line, where this letter connects
    // to the previous one.
    const wordStart = {
      x: sum([
        wordCentre.x,
        (letterBase.x - wordCentre.x) * Math.cos(-angleSubtended / 2),
        (letterBase.y - wordCentre.y) * Math.sin(-angleSubtended / 2) * -1,
      ]),
      y: sum([
        wordCentre.y,
        (letterBase.x - wordCentre.x) * Math.sin(-angleSubtended / 2),
        (letterBase.y - wordCentre.y) * Math.cos(-angleSubtended / 2),
      ]),
    }

    // The end of this segment of the word line, where this letter connects to
    // the next one.
    const wordEnd = {
      x: sum([
        wordCentre.x,
        (letterBase.x - wordCentre.x) * Math.cos(angleSubtended / 2),
        (letterBase.y - wordCentre.y) * Math.sin(angleSubtended / 2) * -1,
      ]),
      y: sum([
        wordCentre.y,
        (letterBase.x - wordCentre.x) * Math.sin(angleSubtended / 2),
        (letterBase.y - wordCentre.y) * Math.cos(angleSubtended / 2),
      ]),
    }

    if (["s", "p", "d", "f"].includes(subletters[0].block)) {
      // Start with non-vowel, non-buffer blocks
      // A letter that is 'full' has a complete circle, regardless of whether
      // or not it intersects with the word.
      if (subletters[0].full) {
        // Draw uninterrupted word segment
        this.drawArc(
          wordStart, wordEnd, word.radius,
          { largeArc: angleSubtended > Math.PI, sweep: true },
        )
        // Jump to letter circle and draw it
        this.drawCircle(letterCentre, letterRadius)
      } else {
        // Draw word segment until intersection
        this.drawArc(
          wordStart, letterStart, word.radius,
          { largeArc: false, sweep: true },
        )
        // Draw along letter curve until next intersection
        // TODO determine arc programmatically, not by block
        this.drawArc(
          letterStart, letterEnd, letterRadius,
          { largeArc: subletters[0].block === "s", sweep: false },
        )
        // Draw remainder of word segment and declare finished
        this.drawArc(
          letterEnd, wordEnd, word.radius,
          { largeArc: false, sweep: true },
        )
      }
      // Draw any vowels
      if (subletters.length === 2) {
        // Jump to the vowel and draw its circle
        this.drawCircle(vowelCentre, vowelRadius)

        this.drawLine(
          wordCentre, vowelCentre,
          { type: "debug", purpose: "position" },
        )
      }
    } else if (subletters[0].block === "buffer") {
      // Draw the buffer, which is just an empty word segment
      this.drawArc(
        wordStart, wordEnd, word.radius,
        { largeArc: false, sweep: true },
      )
    } else if (subletters[0].block === "v") {
      // Draw the uninterrupted word segment
      this.drawArc(
        wordStart, wordEnd, word.radius,
        { largeArc: angleSubtended > Math.PI, sweep: true },
      )
      // Jump to the vowel and draw its circle
      this.drawCircle(vowelCentre, vowelRadius)

      this.drawLine(
        wordCentre, vowelCentre,
        { type: "debug", purpose: "position" },
      )
    }

    // Make a debug path to show inter-letter boundaries
    this.drawLine(
      wordCentre, wordStart,
      { type: "debug", purpose: "angle" },
    )

    // Make a debug path to show the percieved size of the word
    this.drawArc(
      wordStart, wordEnd, word.radius,
      { largeArc: angleSubtended > Math.PI, sweep: true },
      { type: "debug", purpose: "circle" },
    )
  }

  /**
   * Set the angular location of this letter based on its position in the
   * word.
   *
   * @param word - The word that contains this letter.
   * @param index - The index of this letter in the word.
   */
  addAngularLocation (word: Word, index: number): void {
    this.angularLocation = (
      word.phrases.slice(0, index + 1).reduce((total, letter) => {
        return total + letter.subletters[0].absoluteAngularSize!
      }, 0) -
      (word.phrases[0].subletters[0].absoluteAngularSize! / 2) -
      (word.phrases[index].subletters[0].absoluteAngularSize! / 2)
    )
  }
}
