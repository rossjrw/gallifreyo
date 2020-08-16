import { LetterData } from '@/types/alphabets'

/*
 * Tokenised and Rendered Input
 *
 * The list of rendered tokens derived from user input.
 *
 * Each phrase is represented by a single circle on the image, which contains
 * other phrases. A phrase is eventually a list of words, which is a list of
 * letters, and the letters contain drawing info.  Each circle needs an ID
 * that is a hash of its contents, for caching.
 *
 * Optional properties denote those that will be calculated during render.
 * During tokenisation, these properties will not exist.
 */

export interface Path {
  d: string
  type: "default" | "debug"
  purpose?: "angle" | "position" | "circle"
}

interface Phrase {
  // Token properties
  id: string | number
  // Render properties
  relativeAngularSize?: number
  absoluteAngularSize?: number
  angularLocation?: number
  x?: number
  y?: number
  radius?: number
  // Drawing properties
  paths?: Path[]
}

export interface Sentence extends Phrase {
  depth: "sentence"
  phrases: (Sentence | Word)[]
}

export interface Word extends Phrase {
  depth: "word"
  // Token properties
  id: string | number
  phrases: Letter[]
}

export interface Letter {
  depth: "letter"
  // Token properties
  id: string | number
  subletters: Subletter[]
  // Render properties
  height?: number
  angularLocation?: number
  // Drawing properties
  paths?: Path[]
  transform?: string
}

export interface Subletter extends LetterData {
  depth: "subletter"
  [_: string]: unknown    // Allows string-based assignment
  // Render properties
  height?: number
  full?: boolean          // Circle is full or cut off by word line
  relativeAngularSize?: number
  absoluteAngularSize?: number
}
