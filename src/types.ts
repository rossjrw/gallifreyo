export interface State {
  text: string
  alphabets: AlphabetsData
  settings: Settings
  structures: string[]
}

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

export type TokenisedPhrase = TokenisedSentence | TokenisedWord

export interface TokenisedSentence {
  [index: number]: TokenisedPhrase
}

export interface TokenisedWord {
  [index: number]: TokenisedLetter
}

export interface TokenisedLetter {
  value: string
}
