import { Phrase, Word, Letter, Settings } from '@/types'

export function renderTokenisedInput(
  tokenisedInput: Phrase[],
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
  for (const phrase of tokenisedInput) {
    phrase = renderPhrase(phrase, settings)
  }
  return null
}

export function renderPhrase(
  phrase: Phrase,
  settings: Settings,
): Phrase {
  /**
   * Renders a single phrase, which contains either sentences or words. If
   * sentences, this is recursively called (creating a new circle each time)
   * until words are being drawn.
   *
   * @param phrase: The phrase to render.
   * @param settings: The settings object, for configuration.
   * @returns
   */
}

export function renderWord(
  word: Word,
  settings: Settings,
): Word {
  /**
   * Renders a single word, which contains only letters.
   *
   * @param word: The word to render.
   * @param settings: The settings object, for configuration.
   * @returns
   */
  // Note: A given letter can be null, which means do not render. Therefore the
  // unfiltered length of a word cannot be trusted.
}

export function renderLetter(
  letter: Letter,
  settings: Settings,
): Letter {
  /**
   * Renders a single letter.
   *
   * @param letter.
   * @param settings: The settings object, for configuration.
   * @returns
   */
  // Note: A given letter can be null, which means do not render.
}

