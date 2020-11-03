import { Settings } from '@/types/state'
import { Phrase } from '@/classes/Phrase'
import { Word } from '@/classes/Word'

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

    // Assign normalised relative angles to each subphrase
    this.addRelativeAngularSizes()

    // Calculate the sum of the relative angles
    const relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0)

    // Convert relative angles to absolute angles (radians)
    this.addAbsoluteAngularSizes(relativeAngularSizeSum)

    // Assign positions and calculate the size of each subphrase, and then
    // render them
    this.phrases.forEach((phrase, index) => {
      phrase.calculateGeometry(this, index)
      phrase.draw()
    })

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
}
