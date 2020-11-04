import { Collisions } from "detect-collisions"
import { range } from "lodash"

import { Settings } from '@/types/state'
import { Phrase } from '@/classes/Phrase'
import { Word } from '@/classes/Word'
import { getSpiralCoord } from '@/functions/geometry'

export class Sentence extends Phrase {
  depth: 'sentence'
  phrases: (Sentence | Word)[]

  constructor(id: number, settings: Settings, phrases: (Sentence | Word)[]) {
    super(id, settings)
    this.depth = 'sentence'
    this.phrases = phrases
  }

  draw (): void {
    // If this sentence contains more than one subphrase, then draw a circle
    // around it
    if (this.phrases.length > 1) {
      this.drawCircle(this, this.radius, { type: 'default' })
    }

    // XXX Should relative and absolute angular sizes be computed in
    // calculateGeometry? They're not required for all positioning algorithms
    // Assign normalised relative angles to each subphrase
    this.addRelativeAngularSizes()

    // Calculate the sum of the relative angles
    const relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0)

    // Convert relative angles to absolute angles (radians)
    this.addAbsoluteAngularSizes(relativeAngularSizeSum)

    // Assign positions and calculate the size of each subphrase
    this.calculateGeometry()

    // Render them
    this.phrases.forEach(phrase => phrase.draw())

    // Make the debug paths for the subphrases
    this.phrases.forEach((phrase, index) => {
      // Angular debug path: blue lines to show the angle subtended by this
      // phrase
      // XXX phrase.angularLocation CAN be undef (spiral)
      const subphraseAngularLocations = {
        start: {
          x: this.x + Math.sin(
            phrase.angularLocation! - phrase.absoluteAngularSize! / 2
          ) * this.radius,
          y: this.y - Math.cos(
            phrase.angularLocation! - phrase.absoluteAngularSize! / 2
          ) * this.radius,
        },
        end: {
          x: this.x + Math.sin(
            phrase.angularLocation! + phrase.absoluteAngularSize! / 2
          ) * this.radius,
          y: this.y - Math.cos(
            phrase.angularLocation! + phrase.absoluteAngularSize! / 2
          ) * this.radius,
        }
      }
      this.drawLine(
        this, subphraseAngularLocations.start,
        { type: 'debug', purpose: 'angle' },
      )
      this.drawLine(
        this, subphraseAngularLocations.end,
        { type: 'debug', purpose: 'angle' },
      )
      const sizeMod = (index + 1) / 20
      const angularDebugPathCurvePoints = {
        start: {
          x: this.x - (this.x - subphraseAngularLocations.start.x) * sizeMod,
          y: this.y - (this.y - subphraseAngularLocations.start.y) * sizeMod,
        },
        end: {
          x: this.x - (this.x - subphraseAngularLocations.end.x) * sizeMod,
          y: this.y - (this.y - subphraseAngularLocations.end.y) * sizeMod,
        }
      }
      this.drawArc(
        angularDebugPathCurvePoints.start,
        angularDebugPathCurvePoints.end,
        this.radius * sizeMod,
        { largeArc: phrase.absoluteAngularSize! > Math.PI, sweep: true },
        { type: 'debug', purpose: 'angle' },
      )
      this.drawLine(
        this, subphraseAngularLocations.start,
        { type: 'debug', purpose: 'angle' },
      )
      this.drawLine(
        this, subphraseAngularLocations.end,
        { type: 'debug', purpose: 'angle' },
      )

      // Positional debug path: red lines to show the position of the phrase
      // relative to its parent and its radius
      this.drawLine(
        this, phrase,
        { type: 'debug', purpose: 'position' },
      )
      this.drawLine(
        { x: phrase.x - phrase.radius, y: phrase.y },
        { x: phrase.x + phrase.radius, y: phrase.y },
        { type: 'debug', purpose: 'position' },
      )
    })
  }

  addRelativeAngularSizes (): void {
    /**
     * Sets the relative angular size on each subphrase, normalised such that
     * they average to 1.
     */
    this.phrases.forEach(phrase => {
      phrase.relativeAngularSize = Math.pow(
        phrase.phrases.length, this.settings.config.sizeScaling
      )
    })

    // Calculate the sum of the relative angles, excluding buffers
    const relativeAngularSizeSum = this.phrases.reduce((total, phrase) => {
      return total + phrase.relativeAngularSize!
    }, 0)

    // Normalise relative angles such that they average to 1
    // This is so that buffers are always consistent
    this.phrases.forEach((phrase) => {
      phrase.relativeAngularSize = (
        phrase.relativeAngularSize! /
          (relativeAngularSizeSum / this.phrases.length)
      )
    })
  }

  addAbsoluteAngularSizes (relativeAngularSizeSum: number): void {
    /**
     * Convert relative angular sizes on subphrases to absolute angular sizes.
     *
     * TODO This will fail when the relative angular sizes do not average to 1.
     */
    this.phrases.forEach((phrase) => {
      phrase.absoluteAngularSize = (
        phrase.relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
      )
    })
  }

  addRadiusFromBuffer (parent: Sentence): void {
    /**
     * Calculate the radius of this sentence from the buffer radius.
     */
    const bufferWidth = parent.radius * this.settings.config.buffer.sentence
    this.radius = this.bufferRadius! - bufferWidth
  }

  calculateGeometry (): void {
    /**
     * Calculates the geometry of each of this sentence's subphrases.
     *
     * 'Geometry' refers to the x, y, and  properties of a phrase, with
     * angularLocation sometimes being used as an intermediary property.
     *
     * This method selects a positioning algorithm and then executes it.
     *
     * @param parent: The parent phrase.
     * @param index: The index of the subphrase in the parent phrase.
     * @param relativeAngularSizeSum: The sum of relative angles for all
     * phrases and buffers in the parent phrase.
     * @returns void; Modifies the subphrase in place to add x, y, radius, and
     * angularLocation
     */

    let positionAlgorithm = this.settings.config.positionAlgorithm

    // If the positioning algorithm is marked as automatic, pick the best one
    // for this phrase
    if (positionAlgorithm === 'Automatic') {
      if (this.phrases.length > 8) {
        positionAlgorithm = 'Spiral'
      } else {
        positionAlgorithm = 'Radial'
      }
    }

    // The organic algorithm breaks for single phrases
    if (positionAlgorithm === 'Organic' && this.phrases.length === 1) {
      positionAlgorithm = 'Radial'
    }

    if (positionAlgorithm === 'Radial') {
      this.calculateRadialGeometry()
    } else if (positionAlgorithm === 'Spiral') {
      this.calculateSpiralGeometry()
    } else if (positionAlgorithm === 'Organic') {
      this.calculateOrganicGeometry()
    }

    this.phrases.forEach(subphrase => {
      // Make a debug path to show the buffer
      subphrase.drawCircle(
        subphrase, subphrase.bufferRadius!,
        { type: 'debug', purpose: 'circle' },
      )
    })
  }

  calculateRadialGeometry (): void {
    /**
     * The basic positioning algorithm. Each subphrase is placed around a
     * circle, taking up as much space as possible in its allocated segment.
     *
     * Size scaling affects the angle subtended by each phrase within the
     * circle.
     *
     * Works well at low disparity. Much faster than the organic algorithm.
     */
    this.phrases.forEach((subphrase, index) => {
      // Calculate the angle subtended by the subphrase's radius
      const radialSubtension = subphrase.absoluteAngularSize! / 2
      // Derive the radii of the buffer and the subphrase itself
      if (this.phrases.length > 1) {
        subphrase.bufferRadius = (
          (this.radius! * Math.sin(radialSubtension))
          / (Math.sin(radialSubtension) + 1)
        )
        subphrase.addRadiusFromBuffer(this)
      } else {
        subphrase.bufferRadius = this.radius!
        subphrase.radius = subphrase.bufferRadius
      }

      // Calculate the angle that this subphrase is at relative to its parent
      // phrase
      subphrase.addAngularLocation(this, index)

      // Calculate coordinates for transformation
      const translate = {
        x: Math.cos(subphrase.angularLocation! + Math.PI / 2) *
          (-this.radius! + subphrase.bufferRadius!),
        y: Math.sin(subphrase.angularLocation! + Math.PI / 2) *
          (-this.radius! + subphrase.bufferRadius!),
      }
      subphrase.x = this.x! + translate.x
      subphrase.y = this.y! + translate.y
    })
  }

  calculateSpiralGeometry (): void {
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
    const spiralBuffer = 1 + this.settings.config.buffer.word

    // Use the y coordinate of a theoretical final letter to estimate the
    // radius of the spiral
    // The final letter would be place in the middle of the spiral
    const estimatedSpiralRadius = -getSpiralCoord(
      spiralBuffer,
      spiralBuffer,
      this.phrases.length,
      0 // XXX n is reversed - should this be length also?
    )[1]

    // Spirals are slightly smaller than circles, so calculate the wanted
    // radius into a multiplier value
    // TODO more refined process including centre shifting
    // XXX I don't think /2 is correct
    const targetSpiralRadius = this.radius! / 2
    const multiplier = targetSpiralRadius / estimatedSpiralRadius

    this.phrases.forEach((subphrase, index) => {
      subphrase.bufferRadius = multiplier / 2
      subphrase.addRadiusFromBuffer(this)
      // why does it need to be /2 ???
      // because the multiplier is the length of the unit diameter

      // Calculate coordinates of the word
      const coords = getSpiralCoord(
        spiralBuffer,
        spiralBuffer,
        this.phrases.length,
        // length is sent instead of length-1 to ignore the final point of the
        // spiral - do not want to render a word exactly in the centre
        index,
        multiplier,
      )
      subphrase.x = this.x! + coords[0]
      subphrase.y = this.y! + coords[1]
    })
  }

  calculateOrganicGeometry (): void {
    /**
     * An advanced positioning algorithm. Each subphrase is initially placed
     * around a circle, and then they are all grown simultaneously, pushing
     * each other aside until they occupy as much space as possible.
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
        Math.cos(angle) * this.radius + this.x,
        Math.sin(angle) * this.radius + this.y,
      ]
    })
    boundaryPoints.forEach((thisPoint, index) => {
      const nextIndex = index == boundaryRes - 1 ? 0 : index + 1
      const nextPoint = boundaryPoints[nextIndex]
      collisions.createPolygon(0, 0, [thisPoint, nextPoint])
      this.drawLine(
        { x: thisPoint[0], y: thisPoint[1] },
        { x: nextPoint[0], y: nextPoint[1] },
        { type: 'debug', purpose: 'circle' },
      )
    })

    // Compute necessary properties on each subphrase
    // XXX Mostly duplicated from radial algorithm - TODO split algorithms into
    // their own files and reuse functions
    this.phrases.forEach((subphrase, index) => {
      // Calculate the angle subtended by the subphrase's radius
      const radialSubtension = subphrase.absoluteAngularSize! / 2
      // Derive the radii of the buffer and the subphrase itself
      if (this.phrases.length > 1) {
        subphrase.bufferRadius = (
          (this.radius! * Math.sin(radialSubtension))
          / (Math.sin(radialSubtension) + 1)
        )
      } else {
        subphrase.bufferRadius = this.radius!
      }

      // Calculate the angle that this subphrase is at relative to its parent
      // phrase
      subphrase.addAngularLocation(this, index)

      // Calculate coordinates for transformation
      const translate = {
        x: Math.cos(subphrase.angularLocation! + Math.PI / 2) *
          (-this.radius! + subphrase.bufferRadius!),
        y: Math.sin(subphrase.angularLocation! + Math.PI / 2) *
          (-this.radius! + subphrase.bufferRadius!),
      }
      subphrase.x = this.x! + translate.x
      subphrase.y = this.y! + translate.y
    })

    // Create collision bodies from subphrases.
    const bodies = this.phrases.map(phrase => {
      return collisions.createCircle(
        phrase.x, phrase.y, phrase.relativeAngularSize
      )
    })

    let locks = 0
    console.log("Doing organic")
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
    this.phrases.forEach((subphrase, index) => {
      subphrase.x = bodies[index].x
      subphrase.y = bodies[index].y
      subphrase.bufferRadius = bodies[index].radius * bodies[index].scale
      subphrase.addRadiusFromBuffer(this)
    })
  }
}
