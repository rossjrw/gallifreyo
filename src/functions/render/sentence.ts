import { Settings, Phrase, Sentence } from '@/types'
import { setRelativePhraseAngle } from '@/functions/setAngles'
import { calculateSubphraseGeometry } from '@/functions/geometry'
import { renderWord } from '@/functions/render/word'

export function renderPhrase(
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
  sentence.phrases.forEach((phrase: Phrase) => {
    setRelativePhraseAngle(phrase, settings)
  })

  // Calculate the sum of the relative angles
  // Note that this calculation includes buffers between letters, which at this
  // point do not yet exist
  const relativeAngularSizeSum = sentence.phrases.reduce(
    (total: number, phrase: Phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0
  ) + (settings.config.buffer.word * sentence.phrases.length)

  // Convert relative angles to absolute angles (radians)
  sentence.phrases.forEach((phrase: Phrase) => {
    phrase.absoluteAngularSize = (
      phrase.relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
    )
  })

  // Assign positions and calculate the size of each subphrase, and then render
  // them
  sentence.phrases.forEach((phrase: Phrase, subphrase: number) => {
    calculateSubphraseGeometry(
      sentence,
      subphrase,
      settings.structure,
      relativeAngularSizeSum,
      settings,
    )
    // TODO if subphrase is not word... recurse?
    if (phrase.depth === "sentence") {
      renderPhrase(
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
  sentence.phrases.forEach((phrase: Phrase, index: number) => {
    // Angular debug path: blue lines to show the angle subtended by this
    // phrase
    let subphraseAngularDebugPath = ""
    const angularLocation = (
      sentence.phrases.slice(0, index + 1).reduce(
        (total: number, subphrase: Phrase) => {
          return total + subphrase.absoluteAngularSize!
        }, 0
      )
      - (sentence.phrases[0].absoluteAngularSize! / 2)
      - (sentence.phrases[index].absoluteAngularSize! / 2)
      + (index * settings.config.buffer.word * 2 * Math.PI
         / relativeAngularSizeSum)
    )
    const subphraseAngularLocations = {
      start: {
        x: Math.sin(
          angularLocation - phrase.absoluteAngularSize!
        ) * sentence.radius!,
        y: Math.cos(
          angularLocation - phrase.absoluteAngularSize!
        ) * sentence.radius!,
      },
      end: {
        x: Math.sin(
          angularLocation + phrase.absoluteAngularSize!
        ) * sentence.radius!,
        y: Math.cos(
          angularLocation + phrase.absoluteAngularSize!
        ) * sentence.radius!,
      }
    }
    subphraseAngularDebugPath += `M ${sentence.x} ${sentence.y} L ${subphraseAngularLocations.start.x} ${subphraseAngularLocations.start.y}`
    subphraseAngularDebugPath += `M ${sentence.x} ${sentence.y} L ${subphraseAngularLocations.end.x} ${subphraseAngularLocations.end.y}`
    sentence.paths!.push({d: subphraseAngularDebugPath, type: 'debug0'})

    // Positional debug path: red lines to show the position of the phrase
    // relative to its parent and its radius
    let subphrasePositionDebugPath = ""
    subphrasePositionDebugPath += `M ${sentence.x} ${sentence.y} L ${phrase.x} ${phrase.y}`
    subphrasePositionDebugPath += `m ${-phrase.radius!} 0 l ${2 * phrase.radius!} 0`
    phrase.paths!.push({d: subphrasePositionDebugPath, type: 'debug1'})

  })
}
