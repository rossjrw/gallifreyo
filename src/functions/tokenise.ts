import stringHash from "string-hash"
import {
  LetterData, Phrase, Sentence, Word, Letter, Subletter
} from '@/types'
import { getLetters } from '@/functions/alphabets'

export function tokeniseSentence(
  sentence: string,
  splitBy: string[],
  alphabets: string[],
): Sentence[] {
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
  const phrases: Phrase[] = sentence.split(splitBy[0]).map(
    (phrase: string, index: number, sentenceParts: string[]) => {
      // Split the sentence by the first splitBy into a series of phrases.
      // Right now, we don't care what those phrases actually are. I'm using
      // "phrases" to ambiguously mean either a sentence or a word.
      const sentenceId = stringHash(sentenceParts.slice(0, index+1).join(""))
      if (splitBy.length > 1) {
        // This phrase should be split further
        const tokenisedSentence: Sentence = {
          depth: "sentence",
          id: sentenceId,
          phrases: tokeniseSentence(
            phrase,
            splitBy.slice(1),
            alphabets,
          )
        }
        return tokenisedSentence
      } else {
        // The delimiters have been used up, so sentence is a word.
        return {
          depth: "word",
          id: 0,
          phrases: tokeniseAWordIntoLetters(phrase, alphabets),
        } as Word
      }
    }
  )
  return phrases as Sentence[]
}

// export function tokeniseWord(
//   word: string,
//   sentenceId: number,
//   alphabets: string[],
// ): Word {
//   /**
//    * Takes a word and converts it to tokens. I guess for now a token is just
//    * the letter's data from the alphabet file.
//    *
//    * @param word: A string to be tokenised into letters
//    * @param sentenceParts: The sentence so far to be used for hashing.
//    * @param alphabets: List of alphabet names to use
//    * @returns The tokenised word as a list of letters
//    */
//   // Grab the letter data for the selected alphabets
//   const sourceLetters: LetterData[] = getLetters(alphabets)
//   // For each letter, compare it against that letter's length's worth of
//   // characters from the start of the word
//   // If there is a match, save that token and remove those letters
//   // If there is not a match, add a null token and remove one letter
//   const tokenisedLetters: (Letter | null)[] = []
//   // Loop over word, checking first part against alphabets
//   let wordString: string = word.toUpperCase()
//   while (wordString.length > 0) {
//     let tokenisedLetter: (Letter | null) = null
//     for (const sourceLetter of sourceLetters) {
//       if (wordString.startsWith(sourceLetter.value)) {
//         tokenisedLetter = makeTokenisedLetter(
//           subletters,
//           wordString,
//           sentenceId,
//           sourceLetters
//         )
//         break
//       }
//     }
//     if (tokenisedLetter) {
//       // If there was a match, mill the length of the matched letters
//       wordString = wordString.slice(
//         tokenisedLetter.subletters.reduce(
//           (totalLength, subletter) => {
//             return totalLength + subletter.value.length
//           }, 0
//         )
//       )
//     } else {
//       // If there was no match, mill a letter anyway
//       wordString = wordString.slice(1)
//     }
//     tokenisedLetters.push(tokenisedLetter)
//     tokenisedLetters.push(makeTokenisedLetter(
//       wordString,
//       ["BUFFER"],
//       sentenceId,
//       sourceLetters
//     ))
//     // Renderer should be able to handle null tokens
//   }
//   const tokenisedWord: Word = {
//     depth: "word",
//     id: sentenceId,
//     phrases: tokenisedLetters
//   }
//   return tokenisedWord
// }

// function makeTokenisedLetter(
//   wordString: string,
//   subletters: string[],
//   sentenceId: number,
//   subletters: Subletter[],
//   alphabets: string[],
// ): Letter {
//   if (wordString.length === 0) {
//     // If there are no letters left, return the subletters as a letter
//     return {
//       depth: "letter",
//       id: 0, // XXX TODO better id hash
//       subletters: [
//         {
//           depth: "subletter",
//           ...sourceLetter
//         }
//       ] // TODO multiple subletters
//     }
//   } else {
//     // If there is at least one letter left, there are subletters to add
//     const sourceLetters: LetterData[] = getLetters(alphabets)
//     const subletterToAdd
//     for (const sourceLetter of sourceLetters) {
//       if (wordString.startsWith(sourceLetter.value)) {
//         // If the action is create, create a new letter
//         // If the action is attach, add this subletter to the current letter
//         // ...unless there is no letter, in which case, create
//         // ...or unless the limit is reached, in which case, create
//         if (sourceLetter.action === "create" ||
//             subletters.length === 0 || subletters.length >= 2) {
//           // create
//           subletters.push()
//         } else if (sourceLetter.action == "attach") {
//           // attach
//         }
//       // A match was found, so break this loop
//       break
//       }
//     }
//   }
//   if (tokenisedLetter) {
//     // If there was a match, mill the length of the matched letters
//     wordString = wordString.slice(
//       tokenisedLetter.subletters.reduce(
//         (totalLength: number, subletter: Subletter) => {
//           return totalLength + subletter.value.length
//         }, 0
//       )
//     )
//   } else {
//     // If there was no match, mill a letter anyway
//     wordString = wordString.slice(1)
//   }
//   tokenisedLetters.push(tokenisedLetter)
//   tokenisedLetters.push(makeTokenisedLetter(
//     wordString,
//     ["BUFFER"],
//     sentenceId,
//     sourceLetters
//   ))
//   return makeTokenisedLetter(
//     wordString,
//     subletters,
//     sentenceId,
//     subletters,
//     alphabets,
//   )
// }
// }

function tokeniseAWordIntoLetters(
  word: string,
  alphabets: string[],
): Letter[] {
  /**
   * Takes a word as a string. Iterates through it to return its phrases
   * property, which is an array of Letters.
   */
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
    (characters: string[]) => [characters, ["BUFFER"]]
  ).flat()

  // subletterCharacters[0] = ["G", "A"]

  // Convert subletter characters to subletters
  const letters: Letter[] = subletterCharacters.map(
    (characters: string[]): Letter => {
      return {
        depth: "letter",
        id: 0,
        subletters: characters.map(
          (character: string): Subletter => {
            return {
              depth: "subletter",
              ...getLetters(alphabets).find(
                (letter) => letter.value === character
              )!
            }
          }
        )
      }
    }
  )
  return letters
}

function skimACharacterFromAWord(
  word: string,
  alphabets: string[],
): string | null {
  /**
   * Skims a single letter from the first part of a word and returns the
   * relevant character, as a string.
   *
   * If there is no match, returns null.
   */
  // Grab the alphabet directly from source
  const sourceLetters: LetterData[] = getLetters(alphabets)
  // Find the source letter that matches the start of the word
  for (const sourceLetter of sourceLetters) {
    if (word.startsWith(sourceLetter.value)) {
      return sourceLetter.value
    }
  }
  return null
}

function skimSubletterCharactersFromCharacters(
  characters: string[],
  alphabets: string[],
): string[] {
  /**
   * Takes an array of characters, as strings, and returns the first subletter
   * that can be created from that array.
   *
   * Returns subletter as a list of characters, as strings.
   */
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
