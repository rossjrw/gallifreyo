import { Settings } from '@/types/state'
import { Phrase } from '@/classes/Phrase'
import { Word } from '@/classes/Word'
import { calculateRadialGeometry } from "@/algorithms/radial"
import { calculateOrganicGeometry } from "@/algorithms/organic"
import { calculateSpiralGeometry } from "@/algorithms/spiral"

export class Sentence extends Phrase {
  depth: 'sentence'
  phrases: (Sentence | Word)[]

  constructor(id: number, settings: Settings, phrases: (Sentence | Word)[]) {
    super(id, settings)
    this.depth = 'sentence'
    this.phrases = phrases
  }

  draw (): void {
    // If this sentence contains more than one subphrase, then draw a circle
    // around it
    if (this.phrases.length > 1) {
      this.drawCircle(this, this.radius, { type: 'default' })
    }

    // XXX Should relative and absolute angular sizes be computed in
    // calculateGeometry? They're not required for all positioning algorithms
    // Assign normalised relative angles to each subphrase
    this.addRelativeAngularSizes()

    // Calculate the sum of the relative angles
    const relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0)

    // Convert relative angles to absolute angles (radians)
    this.addAbsoluteAngularSizes(relativeAngularSizeSum)

    // Assign positions and calculate the size of each subphrase
    this.calculateGeometry()

    // Render them
    this.phrases.forEach(phrase => phrase.draw())

    // Make the debug paths for the subphrases
    this.phrases.forEach((phrase, index) => {
      // Angular debug path: blue lines to show the angle subtended by this
      // phrase
      // XXX phrase.angularLocation CAN be undef (spiral)
      const subphraseAngularLocations = {
        start: {
          x: this.x + Math.sin(
            phrase.angularLocation! - phrase.absoluteAngularSize! / 2
          ) * this.radius,
          y: this.y - Math.cos(
            phrase.angularLocation! - phrase.absoluteAngularSize! / 2
          ) * this.radius,
        },
        end: {
          x: this.x + Math.sin(
            phrase.angularLocation! + phrase.absoluteAngularSize! / 2
          ) * this.radius,
          y: this.y - Math.cos(
            phrase.angularLocation! + phrase.absoluteAngularSize! / 2
          ) * this.radius,
        }
      }
      this.drawLine(
        this, subphraseAngularLocations.start,
        { type: 'debug', purpose: 'angle' },
      )
      this.drawLine(
        this, subphraseAngularLocations.end,
        { type: 'debug', purpose: 'angle' },
      )
      const sizeMod = (index + 1) / 20
      const angularDebugPathCurvePoints = {
        start: {
          x: this.x - (this.x - subphraseAngularLocations.start.x) * sizeMod,
          y: this.y - (this.y - subphraseAngularLocations.start.y) * sizeMod,
        },
        end: {
          x: this.x - (this.x - subphraseAngularLocations.end.x) * sizeMod,
          y: this.y - (this.y - subphraseAngularLocations.end.y) * sizeMod,
        }
      }
      this.drawArc(
        angularDebugPathCurvePoints.start,
        angularDebugPathCurvePoints.end,
        this.radius * sizeMod,
        { largeArc: phrase.absoluteAngularSize! > Math.PI, sweep: true },
        { type: 'debug', purpose: 'angle' },
      )
      this.drawLine(
        this, subphraseAngularLocations.start,
        { type: 'debug', purpose: 'angle' },
      )
      this.drawLine(
        this, subphraseAngularLocations.end,
        { type: 'debug', purpose: 'angle' },
      )

      // Positional debug path: red lines to show the position of the phrase
      // relative to its parent and its radius
      this.drawLine(
        this, phrase,
        { type: 'debug', purpose: 'position' },
      )
      this.drawLine(
        { x: phrase.x - phrase.radius, y: phrase.y },
        { x: phrase.x + phrase.radius, y: phrase.y },
        { type: 'debug', purpose: 'position' },
      )
    })
  }

  addRelativeAngularSizes (): void {
    /**
     * Sets the relative angular size on each subphrase, normalised such that
     * they average to 1.
     */
    this.phrases.forEach(phrase => {
      phrase.relativeAngularSize = Math.pow(
        phrase.phrases.length, this.settings.config.sizeScaling
      )
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
     *
     * TODO This will fail when the relative angular sizes do not average to 1.
     */
    this.phrases.forEach((phrase) => {
      phrase.absoluteAngularSize = (
        phrase.relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
      )
    })
  }

  addRadiusFromBuffer (parent: Sentence): void {
    /**
     * Calculate the radius of this sentence from the buffer radius.
     */
    const bufferWidth = parent.radius * this.settings.config.buffer.sentence
    this.radius = this.bufferRadius! - bufferWidth
  }

  calculateGeometry (): void {
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
     * @param relativeAngularSizeSum: The sum of relative angles for all
     * phrases and buffers in the parent phrase.
     * @returns void; Modifies the subphrase in place to add x, y, radius, and
     * angularLocation
     */

    // Get the global default algorithm
    let positionAlgorithm = this.settings.config.positionAlgorithm

    // The radial algorithm is the only one that really works for single words
    if (this.phrases.length === 1) {
      positionAlgorithm = 'Radial'
    }

    // If the positioning algorithm is marked as automatic, pick the best one
    if (positionAlgorithm === 'Automatic') {
      if (this.phrases.length > 8) {
        // Spiral is best for long sentences
        positionAlgorithm = 'Spiral'
      } else {
        // Choose between radial and organic based on disparity (the difference
        // between the longest and shortest subphrase)
        // Organic is an objective improvement over radial, but it doesn't look
        // very different at low disparity
        const lengths = this.phrases.map(phrase => phrase.phrases.length)
        const shortest = Math.min(...lengths)
        const longest = Math.max(...lengths)
        positionAlgorithm = longest - shortest > 3 ? 'Organic' : 'Radial'
      }
    }

    // If there is no size scaling, organic should be identical to radial
    if (positionAlgorithm === 'Organic' && !this.settings.config.sizeScaling) {
      positionAlgorithm = 'Radial'
    }

    // Execute the chosen algorithm
    if (positionAlgorithm === 'Radial') {
      calculateRadialGeometry(this)
    } else if (positionAlgorithm === 'Spiral') {
      calculateSpiralGeometry(this)
    } else if (positionAlgorithm === 'Organic') {
      calculateOrganicGeometry(this)
    }

    this.phrases.forEach(subphrase => {
      // Make a debug path to show the buffer
      subphrase.drawCircle(
        subphrase, subphrase.bufferRadius!,
        { type: 'debug', purpose: 'circle' },
      )
    })
  }
}
