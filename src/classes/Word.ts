import { Phrase } from '@/classes/Phrase'
import { Letter } from '@/classes/Letter'

class Word extends Phrase {
  depth: "word"
  // Token properties
  phrases: Letter[]
}
