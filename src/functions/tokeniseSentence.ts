import { TokenisedPhrase } from '@/types'
import { tokeniseWord } from '@/functions/tokeniseWord'

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
   * @param sentence: a string containing the sentence to be tokenised.
   * Gallifreyo's definition of a sentence is a series of words, but what those
   * words are can be anything. Most words will also be sentences.
   * @param splitBy: an array of strings by which to split
   */
  // This is a recursive function that pops from splitBy. There are two
  // possible return values:
  //    1. If there is at least one splitBy delimiter, split the text by it.
  //    The result will be at least one string. Pass that to a new
  //    tokeniseSentence call to be broken down further or tokenised.
  //    2. If all the delimiters have been used up, then the string is a word.
  //    It needs to be broken up into letters and tokenised, and then returned.
  // As a result, a nested structure of tokenised words should be produced.
  if (splitBy.length > 0) {
    // Split the sentence by the first splitBy into a series of phrases.
    // Right now, we don't care what those phrases actually are. I'm using
    // "phrases" to ambiguously mean either a sentence or a word.
    const phrases: TokenisedPhrase[] = []
    for (const phrase of sentence.split(splitBy.shift())) {
      // splitBy[0] is the delimiter for this sentence depth
      // At depth 0, delimiter is "\n\n", therefore each phrase is paragraph
      // This phrase should be further split
      const tokenisedPhrase = tokeniseSentence(phrase, splitBy, alphabets)
      phrases.push(tokenisedPhrase)
    }
    return phrases
  } else {
    // The delimiters have been used up, so sentence is a word.
    return tokeniseWord(sentence, alphabets)
  }
  return null
}
