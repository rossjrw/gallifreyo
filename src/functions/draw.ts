import { Sentence } from "../classes/Sentence"

export function drawTokenisedInput (
  tokenisedInput: Sentence[],
): Sentence[] {
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
  tokenisedInput.forEach(sentence => {
    // Render it
    sentence.draw()
  })
  return tokenisedInput
}
