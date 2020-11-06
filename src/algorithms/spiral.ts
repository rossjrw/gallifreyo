import { Sentence } from "@/classes/Sentence"
import { getSpiralCoord } from '@/functions/geometry'

export function addSpiralGeometry (sentence: Sentence): void {
  /**
   * An advanced positioning algorithm. Places each subphrase on the path of
   * a spiral. This makes good use of the normally-unused space in the
   * middle of the phrase.
   *
   * Size-scaling affects the length of the spiral that the subphrase takes
   * up, though this can cause it to overlap with neighbouring rungs.
   *
   * Works well for very long phrases.
   */
  // Spiral buffer is both the distance between spiral rungs and the
  // distance between words, to ensure visually consistent spacing.
  const spiralBuffer = 1 + sentence.settings.config.buffer.word

  // Use the y coordinate of a theoretical final letter to estimate the
  // radius of the spiral
  // The final letter would be place in the middle of the spiral
  const estimatedSpiralRadius = -getSpiralCoord(
    spiralBuffer,
    spiralBuffer,
    sentence.phrases.length,
    0 // XXX n is reversed - should this be length also?
  )[1]

  // Spirals are slightly smaller than circles, so calculate the wanted
  // radius into a multiplier value
  const targetSpiralRadius = sentence.radius!
  const multiplier = targetSpiralRadius / estimatedSpiralRadius

  sentence.phrases.forEach((subphrase, index) => {
    subphrase.bufferRadius = subphrase.relativeAngularSize! * multiplier / 2
    subphrase.addRadiusFromBuffer(sentence)
    // It needs to be divided by 2 because the multiplier is the length of
    // the unit diameter

    // The sum of relative angles so far, assuming they average to 1, can be
    // used as a modified spiral index that is affected by size scaling
    const cumulativeRelativeAngularSize = (
      sentence.phrases.slice(0, index + 1).reduce((total, phrase) => {
        return total + phrase.relativeAngularSize!
      }, 0)
      - (sentence.phrases[0].relativeAngularSize! / 2)
      - (sentence.phrases[index].relativeAngularSize! / 2)
    )

    // Calculate coordinates of the word
    const coords = getSpiralCoord(
      spiralBuffer,
      spiralBuffer,
      sentence.phrases.length,
      // length is sent instead of length-1 to ignore the final point of the
      // spiral - do not want to render a word exactly in the centre
      cumulativeRelativeAngularSize,
      multiplier,
    )
    subphrase.x = sentence.x + coords[0] - multiplier / 2
    subphrase.y = sentence.y + coords[1] + multiplier / 2
  })
}
