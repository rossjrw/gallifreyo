export interface State {
  inputText: string
  alphabets: Array<Alphabet>
}

export interface Alphabet {
  value: string
  block: string
}

export interface ShermanAlphabet extends Alphabet {
  dots?: number
  vert?: number
  lines: number
}
