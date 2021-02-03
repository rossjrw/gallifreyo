import { Settings } from "../types/state"
import { Phrase } from "../classes/Phrase"
import { Word } from "../classes/Word"
import { addRadialGeometry } from "../algorithms/radial"
import { addOrganicGeometry } from "../algorithms/organic"
import { addSpiralGeometry } from "../algorithms/spiral"

export class Sentence extends Phrase {
  depth: "sentence"
  phrases: (Sentence | Word)[]

  constructor (id: number, settings: Settings, phrases: (Sentence | Word)[]) {
    super(id, settings)
    this.depth = "sentence"
    this.phrases = phrases
  }

  draw (): void {
    // If this sentence contains more than one subphrase, then draw a circle
    // around it
    if (this.phrases.length > 1) {
      this.drawCircle(this, this.radius, { type: "default" })
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
    this.addGeometry()

    // Render them
    this.phrases.forEach(phrase => phrase.draw())
  }

  /**
   * Sets the relative angular size on each subphrase, normalised such that
   * they average to 1.
   */
  addRelativeAngularSizes (): void {
    this.phrases.forEach(phrase => {
      phrase.relativeAngularSize = Math.pow(
        phrase.phrases.length, this.settings.config.sizeScaling,
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

  /**
   * Convert relative angular sizes on subphrases to absolute angular sizes.
   *
   * TODO This will fail when the relative angular sizes do not average to 1.
   */
  addAbsoluteAngularSizes (relativeAngularSizeSum: number): void {
    this.phrases.forEach((phrase) => {
      phrase.absoluteAngularSize = (
        phrase.relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
      )
    })
  }

  /**
   * Calculate the radius of this sentence from the buffer radius.
   */
  addRadiusFromBuffer (parent: Sentence): void {
    const bufferWidth = parent.radius * this.settings.config.buffer.sentence
    this.radius = this.bufferRadius - bufferWidth
  }

  /**
   * Calculates the geometry of each of this sentence's subphrases.
   *
   * 'Geometry' refers to the x, y, and  properties of a phrase, with
   * angularLocation sometimes being used as an intermediary property.
   *
   * This method selects a positioning algorithm and then executes it.
   *
   * @returns void; Modifies the subphrase in place to add x, y, and radius
   */
  addGeometry (): void {
    // Get the global default algorithm
    let positionAlgorithm = this.settings.config.positionAlgorithm

    // The radial algorithm is the only one that really works for single words
    if (this.phrases.length === 1) {
      positionAlgorithm = "Radial"
    }

    // If the positioning algorithm is marked as automatic, pick the best one
    if (positionAlgorithm === "Automatic") {
      if (this.phrases.length > 8) {
        // Spiral is best for long sentences
        positionAlgorithm = "Spiral"
      } else if (this.settings.config.sizeScaling === 0) {
        // If there is no size scaling, organic should be identical to radial
        positionAlgorithm = "Radial"
      } else {
        // Choose between radial and organic based on disparity (the difference
        // between the longest and shortest subphrase)
        // Organic is an objective improvement over radial, but it doesn't look
        // very different at low disparity
        const lengths = this.phrases.map(phrase => phrase.phrases.length)
        const shortest = Math.min(...lengths)
        const longest = Math.max(...lengths)
        positionAlgorithm = longest - shortest > 3 ? "Organic" : "Radial"
      }
    }

    // Execute the chosen algorithm
    if (positionAlgorithm === "Radial") {
      addRadialGeometry(this)
    } else if (positionAlgorithm === "Spiral") {
      addSpiralGeometry(this)
    } else if (positionAlgorithm === "Organic") {
      addOrganicGeometry(this)
    }
  }
}
