import { Settings } from '@/types/state'
import { Phrase } from '@/classes/Phrase'
import { Word } from '@/classes/Word'
import { getSpiralCoord } from '@/functions/geometry'

export class Sentence extends Phrase {
  depth: 'sentence'
  phrases: (Sentence | Word)[]

  constructor(id: number, settings: Settings, phrases: (Sentence | Word)[]) {
    super(id, settings)
    this.depth = 'sentence'
    this.phrases = phrases
    // Initial geometry values, may be overridden later
    this.x = 0
    this.y = 0
    this.radius = 100
  }

  render (): void {
    this.paths = []

    // If this sentence contains more than one subphrase, then draw a circle
    // around it
    if (this.phrases.length > 1) {
      let sentencePath = ""
      sentencePath += `M ${this.x} ${this.y}`
      sentencePath += `m -${this.radius} 0`
      sentencePath += `a ${this.radius} ${this.radius} 0 1 1 ${2 * this.radius!} 0`
      sentencePath += `a ${this.radius} ${this.radius} 0 1 1 ${-2 * this.radius!} 0`
      this.paths.push({d: sentencePath, type: 'default'})
    }

    // Assign normalised relative angles to each subphrase
    this.addRelativeAngularSizes()

    // Calculate the sum of the relative angles, including buffers
    // Note that this calculation includes buffers between letters, which at
    // this point do not yet exist
    const relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0) + (this.settings.config.buffer.phrase * this.phrases.length)

    // Convert relative angles to absolute angles (radians)
    this.addAbsoluteAngularSizes(relativeAngularSizeSum)

    // Assign positions and calculate the size of each subphrase
    this.calculateGeometry(relativeAngularSizeSum)

    // Render them
    this.phrases.forEach(phrase => phrase.render())

    // Make the debug paths for the subphrases
    this.phrases.forEach((phrase, index) => {
      // Angular debug path: blue lines to show the angle subtended by this
      // phrase
      let subphraseAngularDebugPath = ""
      // XXX phrase.angularLocation CAN be undef (spiral)
      const subphraseAngularLocations = {
        start: {
          x: this.x! + Math.sin(
            phrase.angularLocation! - phrase.absoluteAngularSize! / 2
          ) * this.radius!,
          y: this.y! - Math.cos(
            phrase.angularLocation! - phrase.absoluteAngularSize! / 2
          ) * this.radius!,
        },
        end: {
          x: this.x! + Math.sin(
            phrase.angularLocation! + phrase.absoluteAngularSize! / 2
          ) * this.radius!,
          y: this.y! - Math.cos(
            phrase.angularLocation! + phrase.absoluteAngularSize! / 2
          ) * this.radius!,
        }
      }
      subphraseAngularDebugPath += `M ${this.x} ${this.y} L ${subphraseAngularLocations.start.x} ${subphraseAngularLocations.start.y}`
      subphraseAngularDebugPath += `M ${this.x} ${this.y} L ${subphraseAngularLocations.end.x} ${subphraseAngularLocations.end.y}`
      const sizeMod = (index + 1) / 10
      const angularDebugPathCurvePoints = {
        start: {
          x: this.x! +
            -(this.x! - subphraseAngularLocations.start.x) * sizeMod,
          y: this.y! +
            -(this.y! - subphraseAngularLocations.start.y) * sizeMod,
        },
        end: {
          x: this.x! +
            -(this.x! - subphraseAngularLocations.end.x) * sizeMod,
          y: this.y! +
            -(this.y! - subphraseAngularLocations.end.y) * sizeMod,
        }
      }
      subphraseAngularDebugPath += `M ${angularDebugPathCurvePoints.start.x} ${angularDebugPathCurvePoints.start.y} A ${this.radius! * sizeMod} ${this.radius! * sizeMod} 0 ${phrase.absoluteAngularSize! > Math.PI ? "1" : "0"} 1 ${angularDebugPathCurvePoints.end.x} ${angularDebugPathCurvePoints.end.y}`
      phrase.paths!.push({
        d: subphraseAngularDebugPath,
        type: 'debug',
        purpose: 'angle',
      })

      // Positional debug path: red lines to show the position of the phrase
      // relative to its parent and its radius
      let subphrasePositionDebugPath = ""
      subphrasePositionDebugPath += `M ${this.x} ${this.y} L ${phrase.x} ${phrase.y}`
      subphrasePositionDebugPath += `m ${-phrase.radius!} 0 l ${2 * phrase.radius!} 0`
      phrase.paths!.push({
        d: subphrasePositionDebugPath,
        type: 'debug',
        purpose: 'position',
      })
    })
  }

  addRelativeAngularSizes (): void {
    /**
     * Sets the relative angular size on each subphrase, normalised such that
     * they average to 1.
     */
    this.phrases.forEach(phrase => {
      if(Array.isArray(phrase.phrases)){
        // This is a word
        phrase.relativeAngularSize = Math.pow(
          phrase.phrases.length, this.settings.config.sizeScaling
        )
      } else {
        // This is a buffer
        phrase.relativeAngularSize = this.settings.config.buffer.phrase
      }
    })

    // Calculate the sum of the relative angles, excluding buffers
    const relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0)

    // Normalise relative angles such that they average to 1
    // This is so that buffers are always consistent
    this.phrases.forEach((phrase) => {
      phrase.relativeAngularSize = (
        phrase.relativeAngularSize! /
          (relativeAngularSizeSum / this.phrases.length)
      )
    })
  }

  addAbsoluteAngularSizes (relativeAngularSizeSum: number): void {
    /**
     * Convert relative angular sizes on subphrases to absolute angular sizes.
     */
    this.phrases.forEach((phrase) => {
      phrase.absoluteAngularSize = (
        phrase.relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
      )
    })
  }

  calculateGeometry (
    relativeAngularSizeSum: number,
  ): void {
    /**
     * Calculates the geometry of each of this sentence's subphrases.
     *
     * 'Geometry' refers to the x, y, and  properties of a phrase, with
     * angularLocation sometimes being used as an intermediary property.
     *
     * This method selects a positioning algorithm and then executes it.
     *
     * @param parent: The parent phrase.
     * @param index: The index of the subphrase in the parent phrase.
     * @param structure: The algorithm to use for positioning and sizing.
     * @param relativeAngularSizeSum: The sum of relative angles for all
     * phrases and buffers in the parent phrase.
     * @returns void; Modifies the subphrase in place to add x, y, radius, and
     * angularLocation
     */

    let positionAlgorithm = this.settings.config.positionAlgorithm

    // If the positioning algorithm is marked as automatic, pick the best one
    // for this phrase
    if (positionAlgorithm === 'Automatic') {
      if (this.phrases.length > 8) {
        positionAlgorithm = 'Spiral'
      } else {
        positionAlgorithm = 'Radial'
      }
    }

    if (positionAlgorithm === 'Radial') {
      this.calculateRadialGeometry(relativeAngularSizeSum)
    } else if (positionAlgorithm === 'Spiral') {
      this.calculateSpiralGeometry()
    } else if (positionAlgorithm === 'Organic') {
      this.calculateOrganicGeometry(relativeAngularSizeSum)
    }
  }

  calculateRadialGeometry (relativeAngularSizeSum: number): void {
    /**
     * The basic positioning algorithm. Each subphrase is placed around a
     * circle, taking up as much space as possible in its allocated segment.
     *
     * Size scaling affects the angle subtended by each phrase within the
     * circle.
     *
     * Works well at low disparity. Much faster than the organic algorithm.
     */
    this.phrases.forEach((subphrase, index) => {
      // Calculate the angle subtended by the subphrase's radius
      const radialSubtension = subphrase.absoluteAngularSize! / 2
      if (this.phrases.length > 1) {
        const subphraseRadius = (
          (this.radius! * Math.sin(radialSubtension))
          / (subphrase.settings.config.word.height
             * Math.sin(radialSubtension)
             + 1)
        )
        subphrase.radius = subphraseRadius
      } else {
        subphrase.radius = this.radius!
      }

      // Calculate the angle that this subphrase is at relative to its parent
      // phrase
      // For sentences, this does include buffers
      subphrase.addAngularLocation(this, index, relativeAngularSizeSum)

      // Calculate coordinates for transformation
      const translate = {
        x: Math.cos(subphrase.angularLocation! + Math.PI / 2) *
          (-this.radius! + (
            this.settings.config.word.height * subphrase.radius!)),
        y: Math.sin(subphrase.angularLocation! + Math.PI / 2) *
          (-this.radius! + (
            this.settings.config.word.height * subphrase.radius!)),
      }
      subphrase.x = this.x! + translate.x
      subphrase.y = this.y! + translate.y
    })
  }

  calculateSpiralGeometry (): void {
    /**
     * An advanced positioning algorithm. Places each subphrase on the path of
     * a spiral. This makes good use of the normally-unused space in the
     * middle of the phrase.
     *
     * Size-scaling affects the length of the spiral that the subphrase takes
     * up, though this can cause it to overlap with neighbouring rungs.
     *
     * Works well for very long phrases.
     */
    // Spiral buffer is both the distance between spiral rungs and the
    // distance between words, to ensure visually consistent spacing.
    const spiralBuffer = 1 + this.settings.config.buffer.phrase

    // Use the y coordinate of a theoretical final letter to estimate the
    // radius of the spiral
    // The final letter would be place in the middle of the spiral
    const estimatedSpiralRadius = -getSpiralCoord(
      spiralBuffer,
      spiralBuffer,
      this.phrases.length,
      0 // XXX n is reversed - should this be length also?
    )[1]

    // Spirals are slightly smaller than circles, so calculate the wanted
    // radius into a multiplier value
    // TODO more refined process including centre shifting
    // XXX I don't think /2 is correct
    const targetSpiralRadius = this.radius! / 2
    const multiplier = targetSpiralRadius / estimatedSpiralRadius

    this.phrases.forEach((subphrase, index) => {
      subphrase.radius = multiplier/2
      // why does it need to be /2 ???
      // because the multiplier is the length of the unit diameter

      // Calculate coordinates of the word
      const coords = getSpiralCoord(
        spiralBuffer,
        spiralBuffer,
        this.phrases.length,
        // length is sent instead of length-1 to ignore the final point of the
        // spiral - do not want to render a word exactly in the centre
        index,
        multiplier,
      )
      subphrase.x = this.x! + coords[0]
      subphrase.y = this.y! + coords[1]
    })
  }

  calculateOrganicGeometry (relativeAngularSizeSum: number): void {
    /**
     * An advanced positioning algorithm. Each subphrase is initially placed
     * around a circle, and then they are all grown simultaneously, pushing
     * each other aside until they occupy as much space as possible.
     *
     * Size scaling affects the initial size of each subphrase and the initial
     * angle allocated for its growth.
     *
     * Works well for medium-to-low length phrases. Much slower than the other
     * algorithms.
     */
  }
}
