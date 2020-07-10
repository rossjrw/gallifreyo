/*
 * State
 * The Vuex store state
 */

export interface State {
  text: string
  alphabets: AlphabetsData
  settings: Settings
  structures: string[]
  tokenisedInput: TokenisedPhrase[]
  renderedInput: RenderedPhrase[]
}

/*
 * Settings
 * Used for fine-tuning the output and stuff. Any of them can be
 * user-configurable if they're exposed to the UI
 */

export interface Settings {
  structure: string
  scaling: boolean
  watermark: boolean
  width: number
  foregroundColour: string
  backgroundColour: string
  button: string
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
 * Tokenised Input
 * The list of unrendered tokens derived from the input text
 */

export type TokenisedPhrase = TokenisedSentence | TokenisedWord

export type TokenisedSentence = TokenisedPhrase[]

export type TokenisedWord = TokenisedLetter[]

export type TokenisedLetter = LetterData

/*
 * Rendered Input
 * The list of rendered tokens. Each phrase is represented by a single circle
 * on the image, which contains other phrases. A phrase is eventually a list
 * of words, which is a list of letters, and the letters contain drawing info.
 * Each circle needs an ID that is a hash of its contents, for caching.
 * RenderedPhrase should map to SVG.
 */

export type RenderedPhrase = RenderedSentence | RenderedWord

export interface RenderedSentence {
  id: string
  phrases: RenderedPhrase[]
  transform: string
}

export interface RenderedWord {
  id: string
  phrases: RenderedLetter[]
  transform: string
}

export interface RenderedLetter {
  id: string
  d: string          // SVG path
  transform: string  // SVG orientation/sizing
}
