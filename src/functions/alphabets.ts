import toml from "toml"
import { memoize, orderBy, pickBy, values } from "lodash"

import { AlphabetsData, LetterData, AlphabetData } from '@/types'
import alphabets from '!!raw-loader!@/alphabets.toml'


// Why waste time calling this function over and over for the same parameters?
// memoize caches the results per input value
const getLetters = memoize(function getLetters(
  wantedAlphabets: string[],
): LetterData[] {
  /**
   * Selects alphabets from the alphabet data file and returns their letters in
   * order of priority, to be passed to the tokeniser.
   *
   * @param wantedAlphabets: list of alphabet names that are wanted
   * @returns all letters from the selected alphabets in priority order
   */
  // Get all data from the config file
  let alphabetsData: AlphabetsData = toml.parse(alphabets)
  // Extract the data that has been requested
  alphabetsData = pickBy(
    alphabetsData,
    (_, key) => wantedAlphabets.includes(key)
  )
  // Sort the results into priority order
  const combinedAlphabetData: LetterData[] = [].concat(
    orderBy(
      values(alphabetsData),
      (alphabet: AlphabetData) => alphabet.priority,
      'desc'
    ).map(
      (alphabet: AlphabetData) => alphabet.letters
    )
  )
  return combinedAlphabetData
})

export { getLetters }
