import { Settings, Phrase, Sentence } from '@/types'
import { setRelativePhraseAngle } from '@/functions/relativeAngles'
import { calculateSubphraseGeometry } from '@/functions/geometry'

export function renderPhrase(
  sentence: Sentence,
  settings: Settings,
): void {
  // Coordinates of the middle of this sentence
  // TODO determine by argument
  // XXX these properties may already be set on the phrase - could ?? them
  sentence.x = 0
  sentence.y = 0
  sentence.radius = 100 // TODO determine by angular subtension

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
  sentence.phrases.forEach(
    (_: Phrase, subphrase: number) => {
      calculateSubphraseGeometry(
        sentence,
        subphrase,
        sentence.radius!,
        settings.structure,
        relativeAngularSizeSum,
        settings,
      )
      // TODO if subphrase is not word... recurse?
      renderWord(
        sentence.phrases[subphrase],
        subphrase,
      )
    }
  )
}
