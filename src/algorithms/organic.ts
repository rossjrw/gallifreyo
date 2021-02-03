import { Collisions } from "detect-collisions"
import { range } from "lodash"

import { Sentence } from "../classes/Sentence"
import { addRadialGeometry } from "../algorithms/radial"

export function addOrganicGeometry (sentence: Sentence): void {
  /**
   * An advanced positioning algorithm that extends the radial algorithm.
   * Each subphrase is initially placed around a circle, and then they are all
   * grown simultaneously, pushing each other aside until they occupy as much
   * space as possible.
   *
   * Size scaling affects the initial size of each subphrase and the initial
   * angle allocated for its growth.
   *
   * Works well for medium-to-low length phrases. Much slower than the other
   * algorithms.
   */
  const collisions = new Collisions()
  const result = collisions.createResult()
  const boundaryRes = 16
  const growth = 1.02

  // Generate the containing circle
  const boundaryPoints = range(0, boundaryRes).map(index => {
    const angle = index * 2 * Math.PI / boundaryRes - Math.PI / 2
    return [
      Math.cos(angle) * sentence.radius + sentence.x,
      Math.sin(angle) * sentence.radius + sentence.y,
    ]
  })
  boundaryPoints.forEach((thisPoint, index) => {
    const nextIndex = index == boundaryRes - 1 ? 0 : index + 1
    const nextPoint = boundaryPoints[nextIndex]
    collisions.createPolygon(0, 0, [thisPoint, nextPoint])

    // Draw debug lines to visualise the boundary
    sentence.drawLine(
      { x: thisPoint[0], y: thisPoint[1] },
      { x: nextPoint[0], y: nextPoint[1] },
      { type: 'debug', purpose: 'circle' },
    )
  })

  // Compute initial properties on each subphrase
  addRadialGeometry(sentence, false)

  // Create collision bodies from subphrases.
  const bodies = sentence.phrases.map(phrase => {
    return collisions.createCircle(
      phrase.x, phrase.y, phrase.relativeAngularSize
    )
  })

  let locks = 0
  while (locks < bodies.length) {
    locks = 0
    collisions.update()

    bodies.forEach(body => {
      const potentials = body.potentials()

      const touches: {
        magnitude: number
        xDir: number
        yDir: number
        object: 'body' | 'boundary'
      }[] = []

      potentials.forEach(otherBody => {
        if (body.collides(otherBody, result)) {
          touches.push({
            magnitude: result.overlap,
            xDir: result.overlap_x,
            yDir: result.overlap_y,
            object: 'radius' in result.b ? 'body' : 'boundary',
          })
        }
      })
      touches.forEach(touch => {
        // Lock the position if touching 3 objects
        if (touches.length < 3) {
          body.x -= touch.magnitude * touch.xDir
          body.y -= touch.magnitude * touch.yDir
        }
      })
      // Lock the size if touching 2 objects, but count the border once
      if (
        (touches.some(touch => touch.object === 'boundary') ? 1 : 0) +
        touches.filter(touch => touch.object === 'body').length < 2
      ) {
        body.scale *= growth
      } else {
        locks ++
      }
    })
  }

  // Simulation is finished - extract the positions and sizes
  sentence.phrases.forEach((subphrase, index) => {
    subphrase.x = bodies[index].x
    subphrase.y = bodies[index].y
    subphrase.bufferRadius = bodies[index].radius * bodies[index].scale
    subphrase.addRadiusFromBuffer(sentence)
  })

  // Draw debug lines for the subphrases
  sentence.phrases.forEach(phrase => {
    // Draw a circle to show the buffer
    phrase.drawCircle(
      phrase, phrase.bufferRadius,
      { type: 'debug', purpose: 'circle' },
    )

    // Draw a line to indicate the diameter of the phrase
    sentence.drawLine(
      { x: phrase.x - phrase.radius, y: phrase.y },
      { x: phrase.x + phrase.radius, y: phrase.y },
      { type: 'debug', purpose: 'position' },
    )
  })
}
