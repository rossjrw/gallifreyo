export interface State {
  inputText: string
  alphabets: Alphabet[]
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
