export interface State {
  alphabets: Alphabet[]
  settings: Settings
  structures: string[]
}

export interface Alphabet {
  priority: number
  letters: Letter[]
}

export interface Letter {
  value: string
  block: string
}

export interface ShermanLetter extends Letter {
  dots?: number
  vert?: number
  lines: number
}

export interface Settings {
  text: string
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
