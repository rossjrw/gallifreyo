import { Sentence } from "@/classes/Sentence"

export function calculateRadialGeometry (sentence: Sentence): void {
  /**
   * The basic positioning algorithm. Each subphrase is placed around a
   * circle, taking up as much space as possible in its allocated segment.
   *
   * Size scaling affects the angle subtended by each phrase within the
   * circle.
   *
   * Works well at low disparity. Much faster than the organic algorithm.
   */
  sentence.phrases.forEach((subphrase, index) => {
    // Calculate the angle subtended by the subphrase's radius
    const radialSubtension = subphrase.absoluteAngularSize! / 2
    // Derive the radii of the buffer and the subphrase itself
    if (sentence.phrases.length > 1) {
      subphrase.bufferRadius = (
        (sentence.radius! * Math.sin(radialSubtension))
        / (Math.sin(radialSubtension) + 1)
      )
      subphrase.addRadiusFromBuffer(sentence)
    } else {
      subphrase.bufferRadius = sentence.radius!
      subphrase.radius = subphrase.bufferRadius
    }

    // Calculate the angle that this subphrase is at relative to its parent
    // phrase
    subphrase.addAngularLocation(sentence, index)

    // Calculate coordinates for transformation
    const translate = {
      x: Math.cos(subphrase.angularLocation! + Math.PI / 2) *
        (-sentence.radius! + subphrase.bufferRadius!),
      y: Math.sin(subphrase.angularLocation! + Math.PI / 2) *
        (-sentence.radius! + subphrase.bufferRadius!),
    }
    subphrase.x = sentence.x! + translate.x
    subphrase.y = sentence.y! + translate.y
  })
}
