import { sum } from "lodash"

import { Settings } from "../types/state"
import { TextNode } from "../classes/Phrase"
import { Word } from "../classes/Word"
import { Subletter } from "../types/phrases"
import { circleIntersectionPoints } from "../functions/geometry"

type Point = { x: number; y: number }

export class Letter extends TextNode {
  depth: "letter"
  subletters: Subletter[]
  height?: number
  transform?: string
  relativeAngularSizeOverride?: number

  // Stored geometry fields (populated by computeGeometry, read by generatePaths)
  letterCentre?: Point
  letterRadius?: number
  letterStart?: Point
  letterEnd?: Point
  vowelCentre?: Point
  wordStart?: Point
  wordEnd?: Point
  vowelRadius?: number
  wordCentre?: Point
  wordRadius?: number

  constructor (id: number, settings: Settings, subletters: Subletter[]) {
    super(id, settings)
    this.depth = "letter"
    this.subletters = subletters
  }

  computeGeometry (word: Word, angleSubtendedByVowel: number): void {
    const subletters = this.subletters
    const angleSubtended = subletters[0].absoluteAngularSize!
    const angle = this.angularLocation!

    const wordCentre = { x: word.x, y: word.y }

    const letterBase = {
      x: wordCentre.x + word.radius * Math.sin(angle),
      y: wordCentre.y - word.radius * Math.cos(angle),
    }

    const letterRadius = (
      (word.radius * Math.sin(angleSubtended / 2)) /
      (subletters[0].height! * Math.sin(angleSubtended / 2) + 1)
    )
    const vowelRadius = (word.radius * Math.sin(angleSubtendedByVowel / 2)) / 4

    const letterCentre = {
      x: letterBase.x - subletters[0].height! * letterRadius * Math.sin(angle),
      y: letterBase.y + subletters[0].height! * letterRadius * Math.cos(angle),
    }

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
          vowelDistance = vowelRadius
        }
      } else if (subletters[1].vert === 1) {
        vowelStart = letterCentre
        vowelDistance = letterRadius
      }
    }

    const vowelCentre = {
      x: vowelStart.x - vowelDistance * Math.sin(angle),
      y: vowelStart.y + vowelDistance * Math.cos(angle),
    }

    const intersections = circleIntersectionPoints(
      wordCentre.x, wordCentre.y, word.radius,
      letterCentre.x, letterCentre.y, letterRadius,
    )

    const letterStart = { x: intersections[1], y: intersections[3] }
    const letterEnd = { x: intersections[0], y: intersections[2] }

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

    this.letterCentre = letterCentre
    this.letterRadius = letterRadius
    this.letterStart = letterStart
    this.letterEnd = letterEnd
    this.vowelCentre = vowelCentre
    this.wordStart = wordStart
    this.wordEnd = wordEnd
    this.vowelRadius = vowelRadius
    this.wordCentre = wordCentre
    this.wordRadius = word.radius
  }

  generatePaths (): void {
    const subletters = this.subletters
    const angleSubtended = subletters[0].absoluteAngularSize!
    const {
      letterCentre, letterRadius, letterStart, letterEnd,
      vowelCentre, wordStart, wordEnd, vowelRadius, wordCentre, wordRadius,
    } = this

    if (
      !letterCentre || letterRadius === undefined || !letterStart || !letterEnd ||
      !vowelCentre || !wordStart || !wordEnd || vowelRadius === undefined ||
      !wordCentre || wordRadius === undefined
    ) {
      return
    }

    if (["s", "p", "d", "f"].includes(subletters[0].block)) {
      if (subletters[0].full) {
        this.drawArc(
          wordStart, wordEnd, wordRadius,
          { largeArc: angleSubtended > Math.PI, sweep: true },
        )
        this.drawCircle(letterCentre, letterRadius)
      } else {
        this.drawArc(
          wordStart, letterStart, wordRadius,
          { largeArc: false, sweep: true },
        )
        this.drawArc(
          letterStart, letterEnd, letterRadius,
          { largeArc: subletters[0].block === "s", sweep: false },
        )
        this.drawArc(
          letterEnd, wordEnd, wordRadius,
          { largeArc: false, sweep: true },
        )
      }
      if (subletters.length === 2) {
        this.drawCircle(vowelCentre, vowelRadius)
        this.drawLine(wordCentre, vowelCentre, { type: "debug", purpose: "position" })
      }
    } else if (subletters[0].block === "buffer") {
      this.drawArc(
        wordStart, wordEnd, wordRadius,
        { largeArc: false, sweep: true },
      )
    } else if (subletters[0].block === "v") {
      this.drawArc(
        wordStart, wordEnd, wordRadius,
        { largeArc: angleSubtended > Math.PI, sweep: true },
      )
      this.drawCircle(vowelCentre, vowelRadius)
      this.drawLine(wordCentre, vowelCentre, { type: "debug", purpose: "position" })
    }

    this.drawLine(wordCentre, wordStart, { type: "debug", purpose: "angle" })
    this.drawArc(
      wordStart, wordEnd, wordRadius,
      { largeArc: angleSubtended > Math.PI, sweep: true },
      { type: "debug", purpose: "circle" },
    )
  }

  draw (word: Word, angleSubtendedByVowel: number): void {
    this.computeGeometry(word, angleSubtendedByVowel)
    this.generatePaths()
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
      (word.phrases[index].subletters[0].absoluteAngularSize! / 2) +
      word.rotationOffset
    )
  }
}
