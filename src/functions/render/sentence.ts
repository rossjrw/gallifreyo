import { Settings } from '@/types/state'
import { Sentence, Word } from '@/types/phrases'
import { calculateSubphraseGeometry } from '@/functions/geometry'
import { renderWord } from '@/functions/render/word'

export function renderSentence(
  sentence: Sentence,
  settings: Settings,
): void {
  sentence.paths = []

  // If this sentence contains more than one subphrase, then draw a circle
  // around it
  if (sentence.phrases.length > 1) {
    let sentencePath = ""
    sentencePath += `M ${sentence.x} ${sentence.y}`
    sentencePath += `m -${sentence.radius} 0`
    sentencePath += `a ${sentence.radius} ${sentence.radius} 0 1 1 ${2 * sentence.radius!} 0`
    sentencePath += `a ${sentence.radius} ${sentence.radius} 0 1 1 ${-2 * sentence.radius!} 0`
    sentence.paths.push({d: sentencePath, type: 'default'})
  }

  // Assign relative angles to each subphrase
  sentence.phrases.forEach((phrase: Sentence | Word) => {
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
  let relativeAngularSizeSum = sentence.phrases.reduce(
    (total: number, phrase: Sentence | Word) => {
      return total + phrase.relativeAngularSize!
    }, 0
  )

  // Normalise relative angles such that they average to 1
  // This is so that buffers are always consistent
  sentence.phrases.forEach((phrase: Sentence | Word) => {
    phrase.relativeAngularSize = (
      phrase.relativeAngularSize! /
        (relativeAngularSizeSum / sentence.phrases.length)
    )
  })

  // Calculate the sum of the relative angles, including buffers
  // Note that this calculation includes buffers between letters, which at this
  // point do not yet exist
  relativeAngularSizeSum = sentence.phrases.reduce(
    (total: number, phrase: Sentence | Word) => {
      return total + phrase.relativeAngularSize!
    }, 0
  ) + (settings.config.buffer.phrase * sentence.phrases.length)

  // Convert relative angles to absolute angles (radians)
  sentence.phrases.forEach((phrase: Sentence | Word) => {
    phrase.absoluteAngularSize = (
      phrase.relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
    )
  })

  // Assign positions and calculate the size of each subphrase, and then render
  // them
  sentence.phrases.forEach((phrase: Sentence | Word, subphrase: number) => {
    calculateSubphraseGeometry(
      sentence,
      subphrase,
      relativeAngularSizeSum,
      settings,
    )
    // TODO if subphrase is not word... recurse?
    if (phrase.depth === "sentence") {
      renderSentence(
        phrase,
        settings
      )
    } else if (phrase.depth === "word") {
      renderWord(
        phrase,
        settings,
      )
    }
  })

  // Make the debug paths for the subphrases
  sentence.phrases.forEach((phrase: Sentence | Word, index: number) => {
    // Angular debug path: blue lines to show the angle subtended by this
    // phrase
    let subphraseAngularDebugPath = ""
    // XXX phrase.angularLocation CAN be undef (spiral)
    const subphraseAngularLocations = {
      start: {
        x: sentence.x! + Math.sin(
          phrase.angularLocation! - phrase.absoluteAngularSize! / 2
        ) * sentence.radius!,
        y: sentence.y! - Math.cos(
          phrase.angularLocation! - phrase.absoluteAngularSize! / 2
        ) * sentence.radius!,
      },
      end: {
        x: sentence.x! + Math.sin(
          phrase.angularLocation! + phrase.absoluteAngularSize! / 2
        ) * sentence.radius!,
        y: sentence.y! - Math.cos(
          phrase.angularLocation! + phrase.absoluteAngularSize! / 2
        ) * sentence.radius!,
      }
    }
    subphraseAngularDebugPath += `M ${sentence.x} ${sentence.y} L ${subphraseAngularLocations.start.x} ${subphraseAngularLocations.start.y}`
    subphraseAngularDebugPath += `M ${sentence.x} ${sentence.y} L ${subphraseAngularLocations.end.x} ${subphraseAngularLocations.end.y}`
    const sizeMod = (index + 1) / 10
    const angularDebugPathCurvePoints = {
      start: {
        x: sentence.x! +
          -(sentence.x! - subphraseAngularLocations.start.x) * sizeMod,
        y: sentence.y! +
          -(sentence.y! - subphraseAngularLocations.start.y) * sizeMod,
      },
      end: {
        x: sentence.x! +
          -(sentence.x! - subphraseAngularLocations.end.x) * sizeMod,
        y: sentence.y! +
          -(sentence.y! - subphraseAngularLocations.end.y) * sizeMod,
      }
    }
    subphraseAngularDebugPath += `M ${angularDebugPathCurvePoints.start.x} ${angularDebugPathCurvePoints.start.y} A ${sentence.radius! * sizeMod} ${sentence.radius! * sizeMod} 0 ${phrase.absoluteAngularSize! > Math.PI ? "1" : "0"} 1 ${angularDebugPathCurvePoints.end.x} ${angularDebugPathCurvePoints.end.y}`
    phrase.paths!.push({
      d: subphraseAngularDebugPath,
      type: 'debug',
      purpose: 'angle',
    })

    // Positional debug path: red lines to show the position of the phrase
    // relative to its parent and its radius
    let subphrasePositionDebugPath = ""
    subphrasePositionDebugPath += `M ${sentence.x} ${sentence.y} L ${phrase.x} ${phrase.y}`
    subphrasePositionDebugPath += `m ${-phrase.radius!} 0 l ${2 * phrase.radius!} 0`
    phrase.paths!.push({
      d: subphrasePositionDebugPath,
      type: 'debug',
      purpose: 'position',
    })

  })
}
