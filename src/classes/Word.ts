import { Settings } from "../types/state"
import { Phrase } from "../classes/Phrase"
import { Sentence } from "../classes/Sentence"
import { Letter } from "../classes/Letter"
import { letterDataFromBlock } from "../functions/blocks"

export class Word extends Phrase {
  depth: "word"
  phrases: Letter[]
  rotationOffset: number = 0

  constructor (id: number, settings: Settings, phrases: Letter[]) {
    super(id, settings)
    this.depth = "word"
    this.phrases = phrases
  }

  computeGeometry (): void {
    this.addBlockDataToLetters()

    const relativeAngularSizeSum = this.phrases.reduce((total, letter) => {
      return total + (letter.relativeAngularSizeOverride ?? letter.subletters[0].relativeAngularSize!)
    }, 0)

    this.addAbsoluteAngularSizes(relativeAngularSizeSum)

    const vowelAngularSize = (
      this.settings.config.v.width * 2 * Math.PI / relativeAngularSizeSum
    )

    this.phrases.forEach((letter, index) => {
      letter.addAngularLocation(this, index)
      letter.computeGeometry(this, vowelAngularSize)
    })
  }

  generatePaths (): void {
    this.phrases.forEach(letter => letter.generatePaths())
  }

  draw (): void {
    this.computeGeometry()
    this.generatePaths()
  }

  clearPaths (): void {
    super.clearPaths()
    this.phrases.forEach(p => p.clearPaths())
  }

  /**
   * Add letter data from the block presets.
   */
  addBlockDataToLetters (): void {
    this.phrases.forEach((letter) => {
      letterDataFromBlock(letter, this.settings)
    })
  }

  /**
   * Convert relative angular sizes on letters to absolute angular sizes.
   * Respects relativeAngularSizeOverride on individual letters.
   */
  addAbsoluteAngularSizes (relativeAngularSizeSum: number): void {
    this.phrases.forEach((letter) => {
      const relSize = letter.relativeAngularSizeOverride ?? letter.subletters[0].relativeAngularSize!
      letter.subletters[0].absoluteAngularSize = relSize * 2 * Math.PI / relativeAngularSizeSum
    })
  }

  /**
   * Calculate the radius of this sentence from the buffer radius.
   *
   * Parent is passed to this for consistency with the same method on
   * Sentence, as they are not distinguishable.
   */
  addRadiusFromBuffer (_parent: Sentence): void {
    this.radius = this.bufferRadius * (1 - this.settings.config.buffer.word)
  }
}
