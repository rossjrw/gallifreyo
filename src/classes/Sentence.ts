import { Phrase } from '@/classes/Phrase'
import { Word } from '@/classes/Word'

export class Sentence extends Phrase {
  depth: 'sentence'
  phrases: (Sentence | Word)[]

  constructor(id: number, phrases: (Sentence | Word)[]) {
    super(id)
    this.depth = 'sentence'
    this.phrases = phrases
  }
}
