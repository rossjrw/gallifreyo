import { LetterData } from "../types/alphabets"

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

export type Subletter = LetterData & {
  depth: "subletter"
  // Render properties
  height?: number
  full?: boolean // Circle is full or cut off by word line
  relativeAngularSize?: number
  absoluteAngularSize?: number
}
