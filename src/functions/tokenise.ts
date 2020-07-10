import {
  LetterData, TokenisedPhrase, TokenisedWord, TokenisedLetter
} from '@/types'
import { getLetters } from '@/functions/alphabets'

export function tokeniseSentence(
  sentence: string,
  splitBy: string[],
  alphabets: string[],
): TokenisedPhrase[] {
  /**
   * Takes a string and converts it to tokens. Tokens are dicts that instruct
   * the renderer on what to draw e.g. what letters and shapes are present.
   * The renderer will decide how to draw those things e.g. what size
   * everything is.
   *
   * @param sentence: A string containing the sentence to be tokenised.
   * Gallifreyo's definition of a sentence is a series of words, but what those
   * words are can be anything. Most words will also be sentences.
   * @param splitBy: An array of strings by which to split
   * @param alphabets: List of alphabet names to use
   * @returns A recursively-nested list of tokenised sentences containing
   * tokenised words, to be passed to the renderer.
   */
  // This is a recursive function that pops from splitBy. There are two
  // possible return values:
  //    1. If there is at least one splitBy delimiter, split the text by it.
  //    The result will be at least one string. Pass that to a new
  //    tokeniseSentence call to be broken down further or tokenised.
  //    2. If all the delimiters have been used up, then the string is a word.
  //    It needs to be broken up into letters and tokenised, and then returned.
  // As a result, a nested structure of tokenised words should be produced.
  const phrases: TokenisedPhrase[] = []
  for (const phrase of sentence.split(splitBy[0])) {
    // Split the sentence by the first splitBy into a series of phrases.
    // Right now, we don't care what those phrases actually are. I'm using
    // "phrases" to ambiguously mean either a sentence or a word.
    if (splitBy.length > 1) {
      // This phrase should be split further
      const tokenisedPhrase = tokeniseSentence(
        phrase,
        splitBy.slice(1),
        alphabets,
      )
      phrases.push(tokenisedPhrase)
    } else {
      // The delimiters have been used up, so sentence is a word.
      phrases.push(tokeniseWord(sentence, alphabets))
    }
  }
  return phrases
}

export function tokeniseWord(
  word: string,
  alphabets: string[],
): TokenisedWord {
  /**
   * Takes a word and converts it to tokens. I guess for now a token is just
   * the letter's data from the alphabet file.
   *
   * @param word: A string to be tokenised into letters
   * @param alphabets: List of alphabet names to use
   * @returns The tokenised word as a list of letters
   */
  // Grab the letter data for the selected alphabets
  const letters: LetterData[] = getLetters(alphabets)
  // For each letter, compare it against that letter's length's worth of
  // characters from the start of the word
  // If there is a match, save that token and remove those letters
  // If there is not a match, add a null token and remove one letter
  const tokens: TokenisedWord = []
  while (word.length > 0) {
    let token: TokenisedLetter = null
    for (const letter of letters) {
      if (word.startsWith(letter.value)) {
        token = letter
        break
      }
    }
    // If there was no match, mill a letter anyway
    word = word.slice(token ? token.value.length : 1)
    tokens.push(token)
    // Renderer should be able to handle null tokens
  }
  return tokens
}
