import { Phrase } from '@/classes/Phrase'

export class Sentence extends Phrase {
  depth: 'sentence'
  phrases: Phrase[]

  constructor(id: number, phrases: Phrase[]) {
    super(id)
    this.depth = 'sentence'
    this.phrases = phrases
  }
}
