import { Settings } from '@/types/state'
import { Sentence, Word } from '@/types/phrases'

export function calculateSubphraseGeometry(
  sentence: Sentence,
  w: number, // XXX only used as index
  structure: string, // the selected structure type
  relativeAngularSizeSum: number, // the sum of relative angles
  settings: Settings,
): void {
  /**
   * Calculates a phrase's geometry relative to its parent phrase. The parent
   * phrase should be a sentence, i.e. this phrase should not be a letter.
   *
   * @param sentence: The parent phrase.
   * @param w: The index of the subphrase in the parent phrase.
   * @param structure: The algorithm to use for positioning and sizing.
   * @param relativeAngularSizeSum: The sum of relative angles for all phrases
   * and buffers in the parent phrase.
   * sentence.
   * @returns void; Modifies the subphrase in place to add x, y, radius, and
   * angularLocation
   */
  // half of that angle, for some reason
  if (structure === "Simple" || structure === "Size-Scaled") {
    // Calculate the angle subtended by the subphrase's radius
    const radialSubtension = sentence.phrases[w].absoluteAngularSize! / 2
    if (sentence.phrases.length > 1) {
      const subphraseRadius = (
        sentence.radius! * Math.sin(radialSubtension)
        / (settings.config.word.height * Math.sin(radialSubtension) + 1)
      )
      sentence.phrases[w].radius = subphraseRadius
    } else {
      sentence.phrases[w].radius = sentence.radius!
    }

    // Calculate the angle that this subphrase is at relative to its parent
    // phrase
    // For sentences, this does include buffers
    sentence.phrases[w].angularLocation = (
      sentence.phrases.slice(0, w + 1).reduce(
        (total: number, phrase: Sentence | Word) => {
          return total + phrase.absoluteAngularSize!
        }, 0
      )
      - (sentence.phrases[0].absoluteAngularSize! / 2)
      - (sentence.phrases[w].absoluteAngularSize! / 2)
      + (w * settings.config.buffer.phrase * 2 * Math.PI
         / relativeAngularSizeSum)
    )

    // Calculate coordinates for transformation
    const translate = {
      x: Math.cos(sentence.phrases[w].angularLocation! + Math.PI / 2) *
        (-sentence.radius! + (settings.config.word.height * sentence.phrases[w].radius!)),
      y: Math.sin(sentence.phrases[w].angularLocation! + Math.PI / 2) *
        (-sentence.radius! + (settings.config.word.height * sentence.phrases[w].radius!)),
    }
    sentence.phrases[w].x = sentence.x! + translate.x
    sentence.phrases[w].y = sentence.y! + translate.y

  } else if (structure === "Spiral") {
    // For long sentences is is likely appropriate to place each word on the
    // path of a spiral, to avoid excessive wasted space in the middle of the
    // circle.

    // Spiral buffer is both the distance between spiral rungs and the distance
    // between words, to ensure visually consistent spacing.
    const spiralBuffer = 1 + settings.config.buffer.phrase

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
    // TODO more refined process including centre shifting
    // XXX I don't think /2 is correct
    const targetSpiralRadius = sentence.radius! / 2
    const multiplier = targetSpiralRadius / estimatedSpiralRadius

    sentence.phrases[w].radius = multiplier/2
    // why does it need to be /2 ???
    // because the multiplier is the length of the unit diameter

    // Calculate coordinates of the word
    const coords = getSpiralCoord(
      spiralBuffer,
      spiralBuffer,
      sentence.phrases.length,
      // length is sent instead of length-1 to ignore the final point of the
      // spiral - do not want to render a word exactly in the centre
      w,
      multiplier,
    )
    sentence.phrases[w].x = sentence.x! + coords[0]
    sentence.phrases[w].y = sentence.y! + coords[1]

  } else if (structure === "Automatic") {
    if (
      sentence.phrases.length < settings.config.automatic.scaledLessThan
    ) {
      structure = "Size-Scaled"
    } else if (
      sentence.phrases.length > settings.config.automatic.spiralMoreThan
    ) {
      structure = "Spiral"
    } else {
      structure = "Simple"
    }
    calculateSubphraseGeometry(
      sentence,
      w,
      structure,
      relativeAngularSizeSum,
      settings
    )
  }
}

function getSpiralCoord(
  rungWidth: number,
  pointSpacing: number,
  totalPoints: number,
  selectedPoint: number,
  multiplier = 1,
): number[] {
  /**
   * Given parameters to form a spiral and select a point on it, returns the
   * coordinates of that point.
   *
   * @param rungWidth: The distance between each rung of the spiral.
   * @param pointSpacing: The distance between points on the spiral.
   * @param totalPoints: The total number of points to draw on the spiral.
   * @param selectedPoint: The index of the point that is selected, starting
   * from the outer edge of the spiral.
   * @param multiplier: A factor to rescale the spiral size.
   * @returns [x, y]: The coordinates of the selected point.
   */
  // The spiral is drawn starting from the centre. The points need to be
  // plotted starting from the edge, so the index should be inverted
  selectedPoint = totalPoints - selectedPoint

  // Parametric equations to render the spiral
  const x =
    (rungWidth / (2 * Math.PI)
     *
    Math.sqrt(
      (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
    )
    *
    Math.cos(
      Math.sqrt(
        (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
      ) -
      (Math.PI/2) -
      Math.sqrt(
        (2 * pointSpacing * totalPoints) / (rungWidth / (2 * Math.PI))
      )
    ) -
    (rungWidth / 4)
  ) * multiplier

  const y = (
    (rungWidth / (2 * Math.PI))
    *
    Math.sqrt(
      (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
    )
    *
    Math.sin(
      Math.sqrt(
        (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
      ) +
      (Math.PI/2) -
      Math.sqrt(
        (2 * pointSpacing * totalPoints) / (rungWidth / (2 * Math.PI))
      )
    ) +
    rungWidth/4
  ) * multiplier

  return [-x, -y]
  // this does need to be multiplied by the multiplier to be usable
  // why are they both negative? I do not know. but it works.
}
