import { Settings } from '@/types/state'
import { Phrase } from '@/classes/Phrase'
import { Letter } from '@/classes/Letter'
import { letterDataFromBlock } from '@/functions/blocks';

export class Word extends Phrase {
  depth: "word"
  // Token properties
  phrases: Letter[]

  constructor (id: number, settings: Settings, phrases: Letter[]) {
    super(id, settings)
    this.depth = 'word'
    this.phrases = phrases
  }

  render (): void {
    // XXX a lot of this function is very similar to geometry.ts

    // Word already has x, y and radius from geometry.ts

    this.paths = []

    // Assign relative angles and other letter-based properties to each
    // letter
    this.addBlockDataToLetters()

    // Calculate the sum of the relative angles
    // Note that buffers are their own letters, so do not need to be excepted
    // Also note that a letter's relative angle is held by its first subletter
    const relativeAngularSizeSum = this.phrases.reduce((total, letter) => {
      return total + letter.subletters[0].relativeAngularSize!
    }, 0)

    // Convert relative angles to absolute angles (radians)
    this.addAbsoluteAngularSizes(relativeAngularSizeSum)

    // Calculate the absolute angle subtended by a single vowel, so that it is
    // consistent across the entire word
    const vowelAngularSize = (
      this.settings.config.v.width * 2 * Math.PI / relativeAngularSizeSum
    )

    // Assign positions and calculate the size of each subphrase, and then
    // render them
    this.phrases.forEach((letter, index) => {
      // XXX this is the same bit of code used in geometry; should consolidate
      // Sum the angles of the letters so far
      // Do not need to include buffer distance spefically, because the buffers
      // already exist as phantom letters
      letter.addAngularLocation(this, index)
      letter.render(this, vowelAngularSize)
    })
  }

  addBlockDataToLetters (): void {
    /**
     * Add letter data from the block presets.
     */
    this.phrases.forEach((letter) => {
      letterDataFromBlock(letter, this.settings)
    })
  }

  addAbsoluteAngularSizes (relativeAngularSizeSum: number): void {
    /**
     * Convert relative angular sizes on letters to absolute angular sizes.
     */
    this.phrases.forEach((letter) => {
      letter.subletters[0].absoluteAngularSize = (
        letter.subletters[0].relativeAngularSize! * 2 * Math.PI
        / relativeAngularSizeSum
      )
    })
  }
}
