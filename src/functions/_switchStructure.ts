import { Settings, Sentence } from '@/types'

export function switchStructure(
  sentence: Sentence,
  w: number, // the index
  sentenceRadius: number, // the radius of the sentence
  subtensions: number[], // the absolute angles for each letter
  structure: string, // the selected structure type
  rAS: number, // the sum of relative angles
  B: number,  // angular distance between "k_alpha" and "k_0" (???)
  settings: Settings,
): void {
  // This function is being called in a loop, once for each letter

  // the angle subtended by this letter
  const angleSubtended = subtensions[w];
  // half of that angle, for some reason
  const N = angleSubtended / 2;
  // we mustn't change host.structure
  if (structure === "Simple" || structure === "Size-Scaled") {
    let wordRadius: number
    if (sentence.phrases.length > 1) {
      wordRadius = (
        sentenceRadius * Math.cos(Math.PI / 2-N)
      ) / (
        settings.config.word.b * Math.cos(Math.PI / 2-N) + 1
      )
    } else {
      wordRadius = sentenceRadius
    }

    // Calculate coordinates for transformation
    const translate = {
      x: Math.cos(B + Math.PI / 2) *
        (-sentenceRadius + (settings.config.word.b * wordRadius)),
      y: Math.sin(B + Math.PI / 2) *
        (-sentenceRadius + (settings.config.word.b * wordRadius)),
    }
    sentence.phrases[w].transform = `translate(${translate.x},${translate.y})`

    // If the phrase in question consists of letters, render the word
    // TODO if it doesn't, render the phrase
    renderWord(sentence.phrases[w],w,wordRadius);

  } else if (structure === "Spiral") {
    // For long sentences is is likely appropriate to place each word on the
    // path of a spiral, to avoid excessive wasted space in the middle of the
    // circle.

    // Spiral buffer is both the distance between spiral rungs and the 
    const spiralBuffer = 1 + settings.config.buffer.word

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
    const targetSpiralRadius = sentenceRadius / 2
    const multiplier = targetSpiralRadius / estimatedSpiralRadius;

    // so now that we have the multiplier, we need to iterate over the sentence to determine the position of the words

    wordRadius = multiplier/2; // why does it need to be /2 ??? // because the multiplier is the length of the unit diameter

    sentence.words[w].transform = "translate(" + getCoord(spiralBuffer,spiralBuffer,sentence.words.length,w,multiplier).join(",") + ")";
    // we SHOULD be sending length-1, not just length. but this is a hacky way og ignoring the last dot on the spiral



    if(/*Array.isArray(sentence.words[w].letters)*/ true){
      renderWord(sentence.words[w],s_,w,wordRadius);
    }
  } else if (structure === "Automatic") {
    if(subtensions.length < host.settings.automatic.scaledLessThan){
      structure = "Size-Scaled";
    } else if(subtensions.length > host.settings.automatic.spiralMoreThan){
      structure = "Spiral";
    } else {
      structure = "Simple";
    }
    switchStructure(w,sentenceRadius,subtensions,structure,rAS,B);
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
