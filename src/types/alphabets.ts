/*
 * Alphabet storage
 */

export type BlockName = "s" | "p" | "d" | "f" | "v" | "buffer"

type TokenAction = "create" | "attach"

export type AlphabetsData = {
  [name: string]: AlphabetData
}

export type AlphabetData = {
  priority: number
  action: TokenAction
  letters: LetterData[]
}

export type LetterData = {
  value: string
  block: BlockName
  action: TokenAction
  dots: number
  vert: number
  lines: number
}
