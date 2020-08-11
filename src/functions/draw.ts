import { renderSentence } from '@/functions/render/sentence'

import { Settings } from '@/types/state'
import {
  TokenisedSentence, CalculatedSentence, RenderedSentence
} from '@/types/phrases'

export function drawTokenisedInput(
  tokenisedInput: TokenisedSentence[],
  settings: Settings,
): RenderedSentence[] {
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
  const output = tokenisedInput.map(phrase => {
    // Set initial coordinates and radii of the phrase
    const initialPhrase: CalculatedSentence = {
      ...phrase,
      x: 0,
      y: 0,
      radius: 100,
      relativeAngularSize: 0,
      absoluteAngularSize: 0,
      angularLocation: 0,
    }
    // Render it
    return renderSentence(initialPhrase, settings)
  })
  return output
}
