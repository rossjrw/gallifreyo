import { Text } from '@/classes/Phrase'
import { Subletter } from '@/types/phrases'

export class Letter extends Text {
  depth: "letter"
  subletters: Subletter[]
  // Render properties
  height?: number
  // Drawing properties
  transform?: string

  constructor (id: number, subletters: Subletter[]) {
    super(id)
    this.depth = 'letter'
    this.subletters = subletters
  }
}
