import { memoize, orderBy, pickBy, values } from "lodash"

import { AlphabetsData, LetterData, AlphabetData } from "../types/alphabets"

// Blocks:
// s: circle intersects partially with line but is mostly enclosed
// p: circle is detached from line
// d: circle intersects halfway with line, with part below line removed
// f: circle intersects halway with line

const alphabets: AlphabetsData = {
  base: {
    priority: 0,
    action: "create",
    letters: [
      { value: "BUFFER", block: "buffer" },
      { value: "_", block: "buffer" },
    ],
  },

  Sherman: {
    priority: 1,
    action: "create",
    letters: [
      { value: "B", block: "s", dots: 0, lines: 0 },
      { value: "D", block: "s", dots: 3, lines: 0 },
      { value: "F", block: "s", dots: 0, lines: 3 },
      { value: "G", block: "s", dots: 0, lines: 1 },
      { value: "H", block: "s", dots: 0, lines: 2 },
      { value: "J", block: "p", dots: 0, lines: 0 },
      { value: "K", block: "p", dots: 2, lines: 0 },
      { value: "L", block: "p", dots: 3, lines: 0 },
      { value: "M", block: "p", dots: 0, lines: 3 },
      { value: "N", block: "p", dots: 0, lines: 1 },
      { value: "P", block: "p", dots: 0, lines: 2 },
      { value: "T", block: "d", dots: 0, lines: 0 },
      { value: "R", block: "d", dots: 3, lines: 0 },
      { value: "S", block: "d", dots: 0, lines: 3 },
      { value: "V", block: "d", dots: 0, lines: 1 },
      { value: "W", block: "d", dots: 0, lines: 2 },
      { value: "Y", block: "f", dots: 2, lines: 0 },
      { value: "Z", block: "f", dots: 3, lines: 0 },
      { value: "X", block: "f", dots: 0, lines: 2 },
      { value: "C", block: "p", dots: 4, lines: 0 },
      { value: "Q", block: "f", dots: 4, lines: 0 },
    ],
  },

  ShermanVowels: {
    priority: 1,
    action: "attach",
    letters: [
      { value: "A", block: "v", vert: -1, line: 0 },
      { value: "E", block: "v", vert: 0, line: 0 },
      { value: "I", block: "v", vert: 0, line: 1 },
      { value: "O", block: "v", vert: 1, line: 0 },
      { value: "U", block: "v", vert: 0, line: -1 },
    ],
  },

  ShermanDoubles: {
    priority: 2,
    action: "create",
    letters: [
      { value: "CH", block: "s", dots: 2, lines: 0 },
      { value: "WH", block: "p", dots: 1, lines: 0 },
      { value: "SH", block: "d", dots: 2, lines: 0 },
      { value: "PH", block: "d", dots: 1, lines: 0 },
      { value: "TH", block: "f", dots: 0, lines: 0 },
      { value: "NG", block: "f", dots: 0, lines: 3 },
      { value: "QU", block: "f", dots: 0, lines: 1 },
      { value: "GH", block: "f", dots: 1, lines: 3 },
    ],
  },
}

// Why waste time calling this function over and over for the same parameters?
// memoize caches the results per input value
const getLetters = memoize(
  /**
   * Selects alphabets from the alphabet data file and returns their letters in
   * order of priority, to be passed to the tokeniser.
   *
   * @param wantedAlphabets - list of alphabet names that are wanted
   * @returns all letters from the selected alphabets in priority order
   */
  function getLetters (
    wantedAlphabets: string[],
  ): LetterData[] {
    // Get all data from the config file
    let alphabetsData: AlphabetsData = alphabets
    // Extract the data that has been requested
    alphabetsData = pickBy(
      alphabetsData,
      (_, key) => wantedAlphabets.includes(key),
    )
    // Sort the results into priority order
    const alphabetsByPriority: AlphabetData[] = orderBy(
      values(alphabetsData),
      (alphabet: AlphabetData) => alphabet.priority,
      "desc",
    )
    // Get the letters array, with the action attached to each letter
    const lettersByPriority: LetterData[][] = alphabetsByPriority.map(
      (alphabet: AlphabetData) => {
        alphabet.letters = alphabet.letters.map(
          (letter: LetterData) => ({ ...letter, action: alphabet.action }),
        )
        return alphabet.letters
      },
    )
    const combinedAlphabetData: LetterData[] = lettersByPriority.flat()
    return combinedAlphabetData
  },
)

export { getLetters }
