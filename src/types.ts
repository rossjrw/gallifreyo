export interface State {
  inputText: string
  alphabets: Array<Alphabet>
}

export interface Alphabet {
  priority: number
  letters: Array<Letter>
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
