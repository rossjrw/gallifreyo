/*
 * State
 * The Vuex store state
 */

export interface State {
  text: string
  alphabets: AlphabetsData
  phrases: Phrase[]
  settings: Settings
}

/*
 * Settings
 * Used for fine-tuning the output and stuff. Any of them can be
 * user-configurable if they're exposed to the UI
 */

export interface Settings {
  splits: string[]
  structure: string
  scaling: boolean
  watermark: boolean
  width: number
  foregroundColour: string
  backgroundColour: string
  config: Config
}

export interface Config {
  // TODO work out what the FUCK these mean
  s: BlockConfig
  p: BlockConfig
  d: BlockConfig
  f: BlockConfig
  v: VowelBlockConfig
  word: BlockConfig
  buffer: BufferConfig
  automatic: AutomaticConfig
}

export interface BlockConfig {
  // What are b and a????????
  b: number
  a: number
}

export interface VowelBlockConfig extends BlockConfig {
  // What is r???????
  r: number
}

export interface BufferConfig {
  letter: number
  word: number
  sentence: number
}

export interface AutomaticConfig {
  // The naming scheme here is terrible
  scaledLessThan: number
  spiralMoreThan: number
}

/*
 * Alphabet storage
 */

export interface AlphabetsData {
  [name: string]: AlphabetData
}

export interface AlphabetData {
  priority: number
  letters: LetterData[]
}

export interface LetterData {
  value: string
  block: string
}

export interface ShermanLetterData extends LetterData {
  dots?: number
  vert?: number
  lines: number
}

/*
 * Tokenised and Rendered Input
 *
 * The list of rendered tokens derived from user input.
 *
 * Each phrase is represented by a single circle on the image, which contains
 * other phrases. A phrase is eventually a list of words, which is a list of
 * letters, and the letters contain drawing info.  Each circle needs an ID
 * that is a hash of its contents, for caching.
 *
 * Optional properties denote those that will be calculated during render.
 * During tokenisation, these properties will not exist.
 */

export type Phrase = Sentence | Word

export interface Sentence {
  id: string
  phrases: Phrase[]
  transform?: string
}

export interface Word {
  id: string
  phrases: (Letter | null)[]
  transform?: string
}

export interface Letter {
  id: string
  subletters: LetterData[]
  d?: string
  transform?: string
}
