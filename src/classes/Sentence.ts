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
    // Initial geometry values, may be overridden later
    this.x = 0
    this.y = 0
    this.radius = 100
  }

  draw (): void {
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
