import { Settings } from "../types/state"
import { Phrase } from "../classes/Phrase"
import { Word } from "../classes/Word"
import { addRadialGeometry } from "../algorithms/radial"
import { addOrganicGeometry } from "../algorithms/organic"
import { addSpiralGeometry } from "../algorithms/spiral"
import { solveInterlocking } from "../algorithms/interlock"
import { fixBoundingBox } from "../functions/box"

export class Sentence extends Phrase {
  depth: "sentence"
  phrases: (Sentence | Word)[]

  constructor (id: number, settings: Settings, phrases: (Sentence | Word)[]) {
    super(id, settings)
    this.depth = "sentence"
    this.phrases = phrases
  }

  computeGeometry (): void {
    this.addRelativeAngularSizes()

    const relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0)

    this.addAbsoluteAngularSizes(relativeAngularSizeSum)
    this.addGeometry()
    this.phrases.forEach(phrase => phrase.computeGeometry())
  }

  generatePaths (): void {
    if (this.phrases.length > 1) {
      this.drawCircle(this, this.radius, { type: "default" })
    }
    this.phrases.forEach(phrase => phrase.generatePaths())
  }

  draw (): void {
    this.computeGeometry()
    this.generatePaths()
    this.initSolvers()
  }

  private initSolvers (): void {
    const words = this.phrases.filter(p => p.depth === "word")
    if (words.length >= 2 && this.settings.interlocking) {
      solveInterlocking(this, this.settings.config.interlockGap, () => { fixBoundingBox() })
    }
    this.phrases.forEach(phrase => {
      if (phrase.depth === "sentence") (phrase as Sentence).initSolvers()
    })
  }

  clearPaths (): void {
    super.clearPaths()
    this.phrases.forEach(p => p.clearPaths())
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
