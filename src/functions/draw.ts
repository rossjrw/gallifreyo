import { Settings, Sentence, Word } from '@/types'
import { renderSentence } from '@/functions/render/sentence'

export function drawTokenisedInput(
  tokenisedInput: Sentence[],
  settings: Settings,
): (Sentence | Word)[] {
  /**
   * Renders the tokenised input into an SVG image.
   *
   * @param tokenisedInput: The tokenised input.
   * @param settings: The settings object, for configuration.
   * @returns Data to form the final SVG image.
   */
  // XXX Because a list of phrases is being passed to this, each one will be
  // rendered identically. This is not desirable - at the top level, each
  // phrase is a different paragraphs, and this means that each paragraph will
  // be rendered on top of each other (as opposed to words and sentences, which
  // will have their own locations). In future I should pass just one phrase to
  // this function; a top-level phrase that contains only paragraphs.
  tokenisedInput.forEach((phrase: Sentence) => {
    // Set initial coordinates and radii of the phrase
    phrase.x = 0
    phrase.y = 0
    phrase.radius = 100
    // Render it
    renderSentence(phrase, settings)
  })
  return tokenisedInput
}
