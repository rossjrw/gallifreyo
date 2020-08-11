import { DeepPartial } from "tsdef"

import { LetterData } from '@/types/alphabets'

export type Path = {
  d: string
  type: "default" | "debug"
  purpose?: "angle" | "position" | "circle"
}

/*
 * A helper type for transitioning between phrase types.
 */

// export type Between<T1, T2> = Omit<T1, keyof T2> & Partial<T2>
// export type Between<T1, T2> = T1 & T2
// export type Between<T1, T2> = T1 & Partial<T2>
export type Between<T1, T2> = T1 & DeepPartial<T2>
export type DeepRequired<T> = {
  [P in keyof T]: T[P] extends Array<infer I>
    ? Array<DeepRequired<I>>
    : DeepRequired<T[P]>;
};

/*
 * Phrases
 *
 * A generic interface that could represent either a sentence or a word, but
 * not a letter.
 */

type TokenisedPhrase = {
  id: string | number
}

type StructuredPhrase = TokenisedPhrase & {
  relativeAngularSize: number
  absoluteAngularSize: number
}

type CalculatedPhrase = StructuredPhrase & {
  x: number
  y: number
  radius: number
  angularLocation: number
}

type RenderedPhrase = CalculatedPhrase & {
  paths: Path[]
}

/*
 * Sentences
 *
 * A container for an array of either sentences or words.
 * Could theoretically nest indefinitely.
 */

type Sentence = {
  depth: "sentence"
}

export type TokenisedSentence = TokenisedPhrase & Sentence & {
  phrases: (TokenisedSentence | TokenisedWord)[]
}

export type StructuredSentence = StructuredPhrase & Sentence & {
  phrases: (TokenisedSentence | TokenisedWord)[]
}

export type CalculatedSentence = CalculatedPhrase & Sentence & {
  phrases: (TokenisedSentence | TokenisedWord)[]
}

export type RenderedSentence = RenderedPhrase & Sentence & {
  phrases: (RenderedSentence | RenderedWord)[]
}

/*
 * Words
 *
 * A container for an array of letters.
 */

type Word = {
  depth: "word"
}

export type TokenisedWord = Word & TokenisedPhrase & {
  phrases: TokenisedLetter[]
}

export type StructuredWord = Word & StructuredPhrase & {
  phrases: TokenisedLetter[]
}

export type CalculatedWord = Word & CalculatedPhrase & {
  phrases: TokenisedLetter[]
}

export type RenderedWord = Word & RenderedPhrase & {
  phrases: RenderedLetter[]
}

/*
 * Letters
 *
 * A container for subletters.
 */

type Letter = {
  depth: "letter"
}

export type TokenisedLetter = Letter & TokenisedPhrase & {
  subletters: TokenisedSubletter[]
}

export type CalculatedLetter = Letter & TokenisedPhrase & {
  subletters: TokenisedSubletter[]
  angularLocation: number
}
export type RenderedLetter = Letter & TokenisedPhrase & {
  subletters: CalculatedSubletter[]
  angularLocation: number
  paths: Path[]
  transform: string
}

/*
 * Subletters
 *
 * A wrapper for LetterData with rendering information.
 */

type Subletter = {
  depth: "subletter"
}

export type TokenisedSubletter = Subletter & TokenisedPhrase & LetterData

export type StructuredSubletter = TokenisedSubletter & {
  height?: number
  full?: boolean
  relativeAngularSize: number
}

export type CalculatedSubletter = StructuredSubletter & {
  absoluteAngularSize: number
}
