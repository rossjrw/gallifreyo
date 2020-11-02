import { Path } from '@/types/phrases'
import { Settings } from '@/types/state'
import { Sentence } from '@/classes/Sentence'
import { getSpiralCoord } from '@/functions/geometry'

export abstract class TextNode {
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

export abstract class Phrase extends TextNode {
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

  calculateGeometry (
    parent: Sentence,
    index: number,
  ): void {
    /**
     * Calculates a phrase's geometry relative to its parent phrase. The parent
     * phrase should be a sentence, i.e. this phrase should not be a letter.
     *
     * 'Geometry' refers to the x, y, radius and angularLocation properties of
     * a phrase.
     *
     * @param parent: The parent phrase.
     * @param index: The index of the subphrase in the parent phrase.
     * @returns void; Modifies the subphrase in place to add x, y, radius, and
     * angularLocation
     */

    let structure = this.settings.config.positionAlgorithm

    // If the positioning algorithm is marked as automatic, pick the best one
    // for this phrase
    if (structure === 'Automatic') {
      if (parent.phrases.length > 8) {
        structure = 'Spiral'
      } else {
        structure = 'Circular'
      }
    }

    if (structure === 'Circular') {
      // The basic algorithm with everything subtending angles of a circle
      // Calculate the angle subtended by the subphrase's radius
      const radialSubtension = this.absoluteAngularSize! / 2
      if (parent.phrases.length > 1) {
        const subphraseRadius = (
          parent.radius! * Math.sin(radialSubtension)
          / (Math.sin(radialSubtension) + 1)
        )
        this.radius = subphraseRadius
      } else {
        this.radius = parent.radius!
      }

      // Calculate the angle that this subphrase is at relative to its parent
      // phrase
      this.addAngularLocation(parent, index)

      // Calculate coordinates for transformation
      const translate = {
        x: Math.cos(this.angularLocation! + Math.PI / 2) *
          (-parent.radius! + this.radius!),
        y: Math.sin(this.angularLocation! + Math.PI / 2) *
          (-parent.radius! + this.radius!),
      }
      this.x = parent.x! + translate.x
      this.y = parent.y! + translate.y

    } else if (structure === 'Spiral') {
      // For long sentences is is likely appropriate to place each word on the
      // path of a spiral, to avoid excessive wasted space in the middle of the
      // circle.

      // Spiral buffer is both the distance between spiral rungs and the
      // distance between words, to ensure visually consistent spacing.
      const spiralBuffer = 1 + this.settings.config.buffer.phrase

      // Use the y coordinate of a theoretical final letter to estimate the
      // radius of the spiral
      // The final letter would be place in the middle of the spiral
      const estimatedSpiralRadius = -getSpiralCoord(
        spiralBuffer,
        spiralBuffer,
        parent.phrases.length,
        0 // XXX n is reversed - should this be length also?
      )[1]

      // Spirals are slightly smaller than circles, so calculate the wanted
      // radius into a multiplier value
      // TODO more refined process including centre shifting
      // XXX I don't think /2 is correct
      const targetSpiralRadius = parent.radius! / 2
      const multiplier = targetSpiralRadius / estimatedSpiralRadius

      this.radius = multiplier/2
      // why does it need to be /2 ???
      // because the multiplier is the length of the unit diameter

      // Calculate coordinates of the word
      const coords = getSpiralCoord(
        spiralBuffer,
        spiralBuffer,
        parent.phrases.length,
        // length is sent instead of length-1 to ignore the final point of the
        // spiral - do not want to render a word exactly in the centre
        index,
        multiplier,
      )
      this.x = parent.x! + coords[0]
      this.y = parent.y! + coords[1]
    }
  }

  addAngularLocation (
    parent: Sentence,
    index: number,
  ): void {
    /**
     * Set the angular location of this subphrase based on its position in the
     * parent phrase.
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
