import { LetterData } from '@/types/alphabets'

export type Path = {
  d: string
  type: "default" | "debug"
  purpose?: "angle" | "position" | "circle"
}

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

// XXX the type of phrases needs to upgrade along with the main type... right?
// this is not strictly true, because we don't go down the whole chain
// rendering all the way for each stage

// TODO map out path of a sentence through the whole thing and track what
// happens to it and when

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
