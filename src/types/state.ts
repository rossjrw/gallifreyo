import { AlphabetsData } from "../types/alphabets"
import { Sentence } from "../classes/Sentence"

/*
 * State
 * The global state
 */

export interface State {
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

type Config = {
  s: BlockConfig
  p: BlockConfig
  d: BlockConfig
  f: BlockConfig
  v: VowelBlockConfig
  buffer: BufferConfig
  automatic: AutomaticConfig
  sizeScaling: number
  positionAlgorithm: "Automatic" | "Radial" | "Organic" | "Spiral"
  dots: DotConfig
}

type BlockConfig = {
  height: number // Height of this letter above (inside) the word circle
  width: number // The base relativeAngularSize for a letter in this block
}

type VowelBlockConfig = BlockConfig & {
  // What is r???????
  r: number
}

type BufferConfig = {
  letter: number
  word: number
  sentence: number
}

type AutomaticConfig = {
  // The naming scheme here is terrible
  scaledLessThan: number
  spiralMoreThan: number
}

/**
 * Configuration for dots on dotted letters.
 *
 * @property sizeScaling - The degree to which dot sizes vary.
 * @property radiusDifference - The difference between the radius of a letter
 * and the radius of the implicit dot circle, expressed as a fraction of the
 * average radius of all letters in this word.
 * @property size - The size of a dot as a fraction of the base line width.
 * @property spacing - The distance between dots as TODO.
 */
type DotConfig = {
  sizeScaling: number
  radiusDifference: number
  size: number
  spacing: number
}
