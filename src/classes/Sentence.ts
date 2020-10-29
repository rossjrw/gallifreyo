import { Settings } from '@/types/state'
import { Phrase } from '@/classes/Phrase'
import { Word } from '@/classes/Word'
import { calculateSubphraseGeometry } from '@/functions/geometry'

export class Sentence extends Phrase {
  depth: 'sentence'
  phrases: (Sentence | Word)[]

  constructor(id: number, phrases: (Sentence | Word)[]) {
    super(id)
    this.depth = 'sentence'
    this.phrases = phrases
    // Initial geometry values, may be overridden later
    this.x = 0
    this.y = 0
    this.radius = 100
  }

  render (settings: Settings): void {
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

    // Assign relative angles to each subphrase
    this.phrases.forEach(phrase => {
      if(Array.isArray(phrase.phrases)){
        // This is a word
        phrase.relativeAngularSize = Math.pow(
          phrase.phrases.length, settings.config.sizeScaling
        )
      } else {
        // This is a buffer
        phrase.relativeAngularSize = settings.config.buffer.phrase
      }
    })

    // Calculate the sum of the relative angles, excluding buffers
    let relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
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

    // Calculate the sum of the relative angles, including buffers
    // Note that this calculation includes buffers between letters, which at this
    // point do not yet exist
    relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0) + (settings.config.buffer.phrase * this.phrases.length)

    // Convert relative angles to absolute angles (radians)
    this.phrases.forEach((phrase) => {
      phrase.absoluteAngularSize = (
        phrase.relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
      )
    })

    // Assign positions and calculate the size of each subphrase, and then render
    // them
    this.phrases.forEach((phrase, subphrase) => {
      calculateSubphraseGeometry(
        this,
        subphrase,
        relativeAngularSizeSum,
        settings,
      )
      phrase.render(settings)
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
}
