import { Path } from '@/types/phrases'
import { Settings } from '@/types/state'
import { Sentence } from '@/classes/Sentence'

export abstract class Text {
  /**
   * Base class for all written nodes.
   */
  id: number
  settings: Settings
  angularLocation?: number
  paths?: Path[]

  constructor (id: number, settings: Settings) {
    this.id = id
    this.settings = settings
  }
}

export abstract class Phrase extends Text {
  /**
   * Base class for sentences and words.
   */
  relativeAngularSize?: number
  absoluteAngularSize?: number
  x?: number
  y?: number
  radius?: number

  constructor (id: number, settings: Settings) {
    super(id, settings)
  }

  addAngularLocation (
    parent: Sentence,
    index: number,
    relativeAngularSizeSum: number,
  ): void {
    /**
     * Set the angular location of this subphrase based on its position in the
     * parent phrase.
     *
     * Used for positioning in the Radial and Organic algorithms.
     *
     * @param parent: The sentence that contains this phrase.
     * @param index: The index of this letter in the word.
     * @param relativeAngularSizeSum: The sum of all the relative anglular
     * sizes in the parent sentence.
     */
    this.angularLocation = (
      parent.phrases.slice(0, index + 1).reduce(
        (total, phrase) => {
          return total + phrase.absoluteAngularSize!
        }, 0
      )
      - (parent.phrases[0].absoluteAngularSize! / 2)
      - (this.absoluteAngularSize! / 2)
      + (index * this.settings.config.buffer.phrase * 2 * Math.PI
         / relativeAngularSizeSum)
    )
  }
}
