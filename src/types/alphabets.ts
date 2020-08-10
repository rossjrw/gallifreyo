/*
 * Alphabet storage
 */

export type AlphabetsData = {
  [name: string]: AlphabetData
}

export type AlphabetData = {
  priority: number
  action: string
  letters: LetterData[]
}

export type LetterData = {
  value: string
  block: string
  action?: string
}

export type ShermanLetterData = LetterData & {
  dots?: number
  vert?: number
  lines: number
}
