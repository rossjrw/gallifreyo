import { AlphabetsData } from '@/types/alphabets'
import { Sentence } from '@/classes/Sentence'

/*
 * State
 * The Vuex store state
 */

export type State = {
  text: string
  alphabets: AlphabetsData
  phrases: Sentence[]
  settings: Settings
}

/*
 * Settings
 * Used for fine-tuning the output and stuff. Any of them can be
 * user-configurable if they're exposed to the UI
 */

export type Settings = {
  splits: string[]
  selectedAlphabets: string[]
  scaling: boolean
  watermark: boolean
  debug: boolean
  width: number
  foregroundColour: string
  foregroundAlpha: number
  backgroundColour: string
  backgroundAlpha: number
  config: Config
}

export type Config = {
  s: BlockConfig
  p: BlockConfig
  d: BlockConfig
  f: BlockConfig
  v: VowelBlockConfig
  buffer: BufferConfig
  automatic: AutomaticConfig
  sizeScaling: number
  positionAlgorithm: 'Automatic' | 'Radial' | 'Organic' | 'Spiral'
}

export type BlockConfig = {
  height: number  // Height of this letter above (inside) the word circle
  width: number  // The base relativeAngularSize for a letter in this block
}

export type VowelBlockConfig = BlockConfig & {
  // What is r???????
  r: number
}

export type BufferConfig = {
  letter: number
  word: number
  sentence: number
}

export type AutomaticConfig = {
  // The naming scheme here is terrible
  scaledLessThan: number
  spiralMoreThan: number
}
