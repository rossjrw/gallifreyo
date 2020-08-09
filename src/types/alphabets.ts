/*
 * Alphabet storage
 */

export interface AlphabetsData {
  [name: string]: AlphabetData
}

export interface AlphabetData {
  priority: number
  action: string
  letters: LetterData[]
}

export interface LetterData {
  value: string
  block: string
  action?: string
}

export interface ShermanLetterData extends LetterData {
  dots?: number
  vert?: number
  lines: number
}
