import { Sentence } from "@/classes/Sentence"

export function addRadialGeometry (sentence: Sentence, debug = true): void {
  /**
   * The basic positioning algorithm. Each subphrase is placed around a
   * circle, taking up as much space as possible in its allocated segment.
   *
   * Size scaling affects the angle subtended by each phrase within the
   * circle.
   *
   * Works well at low disparity. Much faster than the organic algorithm.
   *
   * @param debug: Boolean; whether or not to draw debug lines. Debug lines are
   * not desirable if this function is only being used to calculate initial
   * geometry à la the organic algorithm.
   */
  sentence.phrases.forEach((phrase, index) => {
    // Calculate the angle subtended by the subphrase's radius
    const radialSubtension = phrase.absoluteAngularSize! / 2
    // Derive the radii of the buffer and the subphrase itself
    if (sentence.phrases.length > 1) {
      phrase.bufferRadius = (
        (sentence.radius! * Math.sin(radialSubtension))
        / (Math.sin(radialSubtension) + 1)
      )
      phrase.addRadiusFromBuffer(sentence)
    } else {
      phrase.bufferRadius = sentence.radius!
      phrase.radius = phrase.bufferRadius
    }

    // Calculate the angle that this subphrase is at relative to its parent
    // phrase
    phrase.addAngularLocation(sentence, index)

    // Calculate coordinates for transformation
    const translate = {
      x: Math.cos(phrase.angularLocation! + Math.PI / 2) *
        (-sentence.radius! + phrase.bufferRadius!),
      y: Math.sin(phrase.angularLocation! + Math.PI / 2) *
        (-sentence.radius! + phrase.bufferRadius!),
    }
    phrase.x = sentence.x! + translate.x
    phrase.y = sentence.y! + translate.y
  })

  if (!debug) {
    return
  }

  // Make the debug paths for the subphrases
  sentence.phrases.forEach((phrase, index) => {
    // Draw a circle to show the buffer
    phrase.drawCircle(
      phrase, phrase.bufferRadius,
      { type: 'debug', purpose: 'circle' },
    )

    // Draw lines to show the angle subtended by this phrase
    const phraseAngularLocations = {
      start: {
        x: sentence.x + Math.sin(
          phrase.angularLocation! - phrase.absoluteAngularSize! / 2
        ) * sentence.radius,
        y: sentence.y - Math.cos(
          phrase.angularLocation! - phrase.absoluteAngularSize! / 2
        ) * sentence.radius,
      },
      end: {
        x: sentence.x + Math.sin(
          phrase.angularLocation! + phrase.absoluteAngularSize! / 2
        ) * sentence.radius,
        y: sentence.y - Math.cos(
          phrase.angularLocation! + phrase.absoluteAngularSize! / 2
        ) * sentence.radius,
      }
    }
    sentence.drawLine(
      sentence, phraseAngularLocations.start,
      { type: 'debug', purpose: 'angle' },
    )
    sentence.drawLine(
      sentence, phraseAngularLocations.end,
      { type: 'debug', purpose: 'angle' },
    )

    // Draw a curve around the angle of increasing size to indicate the order
    // of subtended angles within the phrase
    const sizeMod = (index + 1) / 20
    const angularDebugPathCurvePoints = {
      start: {
        x: sentence.x - (sentence.x - phraseAngularLocations.start.x) * sizeMod,
        y: sentence.y - (sentence.y - phraseAngularLocations.start.y) * sizeMod,
      },
      end: {
        x: sentence.x - (sentence.x - phraseAngularLocations.end.x) * sizeMod,
        y: sentence.y - (sentence.y - phraseAngularLocations.end.y) * sizeMod,
      }
    }
    sentence.drawArc(
      angularDebugPathCurvePoints.start,
      angularDebugPathCurvePoints.end,
      sentence.radius * sizeMod,
      { largeArc: phrase.absoluteAngularSize! > Math.PI, sweep: true },
      { type: 'debug', purpose: 'angle' },
    )

    // Draw a line to indicate the phrase's position relative to the parent
    sentence.drawLine(
      sentence, phrase,
      { type: 'debug', purpose: 'position' },
    )

    // Draw a line to indicate the diameter of the phrase
    sentence.drawLine(
      { x: phrase.x - phrase.radius, y: phrase.y },
      { x: phrase.x + phrase.radius, y: phrase.y },
      { type: 'debug', purpose: 'position' },
    )
  })
}
