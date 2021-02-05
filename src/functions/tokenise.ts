import { Settings } from "../types/state"
import { LetterData } from "../types/alphabets"
import { Sentence } from "../classes/Sentence"
import { Word } from "../classes/Word"
import { Letter } from "../classes/Letter"
import { getLetters } from "../functions/alphabets"

let ID_COUNTER = 0

/**
 * Takes a string and converts it to tokens. Tokens are dicts that instruct
 * the renderer on what to draw e.g. what letters and shapes are present.
 * The renderer will decide how to draw those things e.g. what size
 * everything is.
 *
 * @param sentence - A string containing the sentence to be tokenised.
 * Gallifreyo's definition of a sentence is a series of words, but what those
 * words are can be anything. Most words will also be sentences.
 * @param splitBy - An array of strings by which to split
 * @param alphabets - List of alphabet names to use
 * @param settings - A settings object to pass to the constructed phrases.
 * @returns A list of tokenised phrases.
 */
export function tokeniseSentence (
  sentence: string,
  splitBy: string[],
  alphabets: string[],
  settings: Settings,
): Sentence[]
export function tokeniseSentence (
  sentence: string,
  splitBy: string[],
  alphabets: string[],
  settings: Settings,
): (Sentence | Word)[] {
  // This is a recursive function that pops from splitBy. There are two
  // possible return values:
  //    1. If there is at least one splitBy delimiter, split the text by it.
  //    The result will be at least one string. Pass that to a new
  //    tokeniseSentence call to be broken down further or tokenised.
  //    2. If all the delimiters have been used up, then the string is a word.
  //    It needs to be broken up into letters and tokenised, and then returned.
  // As a result, a nested structure of tokenised words should be produced.
  const phrases = sentence.split(splitBy[0]).filter(phrase => {
    // Strip out empty phrases
    return phrase.trim().length > 0
  }).map(phrase => {
    // Split the sentence by the first splitBy into a series of phrases.
    // Right now, we don't care what those phrases actually are. I'm using
    // "phrases" to ambiguously mean either a sentence or a word.
    if (splitBy.length > 1) {
      // This phrase should be split further
      return new Sentence(
        ID_COUNTER++,
        settings,
        tokeniseSentence(phrase, splitBy.slice(1), alphabets, settings),
      )
    } else {
      // The delimiters have been used up, so sentence is a word.
      return new Word(
        ID_COUNTER++,
        settings,
        tokeniseAWordIntoLetters(phrase, alphabets, settings),
      )
    }
  })
  return phrases
}

/**
* Takes a word as a string. Iterates through it to return its phrases
* property, which is an array of Letters.
*/
function tokeniseAWordIntoLetters (
  word: string,
  alphabets: string[],
  settings: Settings,
): Letter[] {
  // I want to loop through the segments of the word in variable stages.
  // When I find a match against the alphabets, I should obey that alphabet's
  // action and use it to assign a subletter.
  // Every other letter that is returned from this function must be a buffer.
  // [1,2,3].map(i => [i,null]).flat()

  // The array of matched characters, as strings
  let matchedCharacters: string[] = []

  // Loop through word and extract the characters
  while (word.length > 0) {
    const nextCharacter = skimACharacterFromAWord(word, alphabets)
    // A match has been found (although it can be null)
    if (nextCharacter !== null) {
      // If it wasn't null, add it to the list
      matchedCharacters.push(nextCharacter)
      // Remove that many letters from the word
      word = word.slice(nextCharacter.length)
    } else {
      // If it was null, do not add a match
      // Remove just one letter from the word
      word = word.slice(1)
    }
  }

  // Convert the matched characters to subletters
  let subletterCharacters: string[][] = []
  while (matchedCharacters.length > 0) {
    const subletterCharacter = skimSubletterCharactersFromCharacters(
      matchedCharacters,
      alphabets,
    )
    matchedCharacters = matchedCharacters.slice(subletterCharacter.length)
    subletterCharacters.push(subletterCharacter)
  }

  // Add a buffer letter after each letter
  subletterCharacters = subletterCharacters.map(
    characters => [characters, ["BUFFER"]],
  ).flat()

  // Convert subletter characters to subletters
  const letters: Letter[] = subletterCharacters.map(characters => {
    return new Letter(
      ID_COUNTER++,
      settings,
      characters.map(
        (character: string) => {
          return {
            depth: "subletter",
            ...getLetters(alphabets).find(
              (letter) => letter.value === character,
            )!,
          }
        },
      ),
    )
  })
  return letters
}

/**
* Skims a single letter from the first part of a word and returns the
* relevant character, as a string.
*
* If there is no match, returns null.
*/
function skimACharacterFromAWord (
  word: string,
  alphabets: string[],
): string | null {
  // Grab the alphabet directly from source
  const sourceLetters: LetterData[] = getLetters(alphabets)
  // Find the source letter that matches the start of the word
  for (const sourceLetter of sourceLetters) {
    if (word.toUpperCase().startsWith(sourceLetter.value)) {
      return sourceLetter.value
    }
  }
  return null
}

/**
* Takes an array of characters, as strings, and returns the first subletter
* that can be created from that array.
*
* Returns subletter as a list of characters, as strings.
*/
function skimSubletterCharactersFromCharacters (
  characters: string[],
  alphabets: string[],
): string[] {
  // Grab the alphabet directly from source
  const sourceLetters: LetterData[] = getLetters(alphabets)
  // Iterate through letters and their actions
  const subletterCharacters: string[] = []
  for (const character of characters) {
    const action = sourceLetters.find(
      (letter) => letter.value === character)!.action
    // Regardless of action, always retain the first character
    if (subletterCharacters.length === 0) {
      subletterCharacters.push(character)
      continue
    }
    // Only retain a further character if the action is attach
    if (subletterCharacters.length === 1 && action === "attach") {
      subletterCharacters.push(character)
      continue
    }
    // Otherwise, the subletter is finished
    break
  }
  return subletterCharacters
}
