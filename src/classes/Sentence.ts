import { Phrase } from '@/classes/Phrase'
import { Word } from '@/classes/Word'

class Sentence extends Phrase {
  depth: 'sentence'
  phrases: (Sentence | Word)[]
}
