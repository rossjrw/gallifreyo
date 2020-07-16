import { Settings, Phrase, Sentence } from '@/types'
import { renderPhrase } from '@/functions/render/sentence'

export function drawTokenisedInput(
  tokenisedInput: Sentence[],
  settings: Settings,
): Phrase[] {
  /**
   * Renders the tokenised input into an SVG image.
   *
   * @param tokenisedInput: The tokenised input.
   * @param settings: The settings object, for configuration.
   * @returns Data to form the final SVG image.
   */
  // Functions elsewhere modify the phrases in-place, so there's not much point
  // changing that now. Maybe a future rework can improve that, but it doesn't
  // seem to be necessary immediately.
  tokenisedInput.forEach((phrase: Sentence) => {
    renderPhrase(phrase, settings)
  })
  return tokenisedInput
}
