import { Path } from '@/types/phrases'
import { Settings } from '@/types/state'
import { Sentence } from '@/classes/Sentence'

export abstract class TextNode {
  /**
   * Base class for all written nodes.
   */
  id: number
  settings: Settings
  angularLocation?: number
  paths: Path[]

  constructor (id: number, settings: Settings) {
    this.id = id
    this.settings = settings
    this.paths = []
  }
}

export abstract class Phrase extends TextNode {
  /**
   * Base class for sentences and words.
   */
  relativeAngularSize?: number
  absoluteAngularSize?: number
  x?: number
  y?: number
  bufferRadius?: number
  radius?: number

  constructor (id: number, settings: Settings) {
    super(id, settings)
  }

  addAngularLocation (
    parent: Sentence,
    index: number,
  ): void {
    /**
     * Set the angular location of this subphrase based on its position in the
     * parent phrase.
     *
     * Used for positioning in the Radial and Organic algorithms.
     *
     * @param parent: The sentence that contains this phrase.
     * @param index: The index of this letter in the word.
     */
    this.angularLocation = (
      parent.phrases.slice(0, index + 1).reduce(
        (total, phrase) => {
          return total + phrase.absoluteAngularSize!
        }, 0
      )
      - (parent.phrases[0].absoluteAngularSize! / 2)
      - (this.absoluteAngularSize! / 2)
    )
  }
}
