import { Settings, Phrase, Letter } from '@/types'
import { letterDataFromBlock } from './blocks';

export function setRelativePhraseAngle(
  phrase: Phrase,
  settings: Settings,
): void {
  /**
   * Get the relative angle subtended by a given phrase in its parent phrase.
   * Angles are relative, e.g. a phrase that contains subphrases which all have
   * an angle of 1 will have entirely equal angles.
   *
   * In a spiral, angular subtension is not relevant, and this function is not
   * called.
   *
   * XXX For words, relative angles are set by block in blocks.ts - possibly
   * the same approach should be applied here?
   *
   * @param phrase: A subphrase whose relative angle will be calculated.
   * @param settings: The entire settings object.
   * @returns The angle subtended by the subphrase in its parent phrase.
   */
  if(Array.isArray(phrase.phrases)){
    // this is a valid word
    if (settings.structure == "Size-Scaled"){
      phrase.relativeAngularSize = phrase.phrases.length;
    } else {
      phrase.relativeAngularSize = 1;
    }
  } else {
    // this is a buffer
    phrase.relativeAngularSize = settings.config.buffer.word;
  }
  // Phrase object has been modified to retain relativeAngularSize
}

export function setRelativeLetterAngle(
  letter: Letter,
  settings: Settings,
): void {
  /**
   * Get the relative angle subtended by a given letter in a word.
   * Angles are relative, e.g. a phrase that contains subphrases which all have
   * an angle of 1 will have entirely equal angles.
   *
   * @param letter: A letter whose relative angle will be calculated.
   * @param settings: The entire settings object.
   * @returns void; Letter is modified to include relativeAngularSize.
   */
  letterDataFromBlock(letter, settings)
}
