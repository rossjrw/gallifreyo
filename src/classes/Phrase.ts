import { Path } from '@/types/phrases'

export abstract class Text {
  /**
   * Base class for all written nodes.
   */
  id: number
  angularLocation?: number
  paths?: Path[]

  constructor (id: number) {
    this.id = id
  }
}

export abstract class Phrase extends Text {
  /**
   * A phrase is the base class for sentences and words.
   */
  relativeAngularSize?: number
  absoluteAngularSize?: number
  x?: number
  y?: number
  radius?: number

  constructor (id: number) {
    super(id)
  }
}
