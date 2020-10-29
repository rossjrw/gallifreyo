import { Phrase } from '@/classes/Phrase'
import { Letter } from '@/classes/Letter'

export class Word extends Phrase {
  depth: "word"
  // Token properties
  phrases: Letter[]

  constructor (id: number, phrases: Letter[]) {
    super(id)
    this.depth = 'word'
    this.phrases = phrases
  }
}
