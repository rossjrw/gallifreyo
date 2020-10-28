import { Path } from '@/types/phrases'

export abstract class Phrase {
  /**
   * A phrase is the base class for sentences and words.
   */
  id: string | number // TODO Which one?
  relativeAngularSize?: number
  absoluteAngularSize?: number
  angularLocation?: number
  x?: number
  y?: number
  radius?: number
  // Drawing properties
  paths?: Path[]

  constructor () {
    /* TODO */
  }
}
