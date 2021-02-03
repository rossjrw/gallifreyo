import { Collisions, Circle, Result, Body } from "detect-collisions"
import { range, zip } from "lodash"

const width = 600
const height = width
const result = new Collisions().createResult()
const circleResolution = 16
const growth = 1.02

export class GrowingCirclesTest {
  element: HTMLDivElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  collisions: Collisions
  result: Result
  bodies: Circle[]
  stopPlease: boolean
  wantsBvh: boolean
  instant: boolean
  startTime: number
  endTime: number

  constructor () {
    this.element = document.createElement("div")
    this.canvas = document.createElement("canvas")
    this.context = this.canvas.getContext("2d")!
    this.collisions = new Collisions()
    this.result = this.collisions.createResult()
    this.bodies = []
    this.stopPlease = false
    this.wantsBvh = false
    this.instant = false
    this.startTime = performance.now()
    this.endTime = 0

    this.canvas.width = width
    this.canvas.height = height

    // Create the containing circle out of lines
    const circlePoints = range(0, circleResolution).map(index => {
      const angle = index * 2 * Math.PI / circleResolution - Math.PI / 2
      return [
        Math.cos(angle) * width / 2 + width / 2,
        Math.sin(angle) * width / 2 + width / 2,
      ]
    })
    circlePoints.forEach((thisPoint, index) => {
      const nextIndex = index === circleResolution - 1 ? 0 : index + 1
      const nextPoint = circlePoints[nextIndex]
      this.collisions.createPolygon(0, 0, [thisPoint, nextPoint])
    })

    this.createCircles()

    this.nextFrame()
  }

  nextFrame (): void {
    this.update()
    if (this.stopPlease) {
      this.stopPlease = false
      return
    }
    if (this.instant) {
      this.nextFrame()
    } else {
      requestAnimationFrame(() => this.nextFrame())
    }
  }

  /**
   * Generate, position and size the word circles.
   */
  createCircles (): void {
    // Clear all existing circles from the screen.
    this.bodies.forEach(body => body.remove())
    this.bodies = []
    // Pick a random number of circles to generate.
    const circleCount = random(2, 8)
    // Ratios determine the relative sizes of the circles.
    // This will eventually be dependent on the length of the word. Note that
    // there is no upper limit.
    const ratios = range(0, circleCount).map(() => random(1, 8))
    const ratioSum = ratios.reduce((a, b) => a + b, 0)
    const bodyAngularSizes = ratios.map(ratio => {
      return ratio * 2 * Math.PI / ratioSum
    })
    const bodyAngularLocations = range(0, circleCount).map(index => {
      return bodyAngularSizes.slice(0, index + 1).reduce(
        (total, size) => total + size, 0,
      ) -
      (bodyAngularSizes[0] / 2) - (bodyAngularSizes[index] / 2)
    })
    const bodyPoints = bodyAngularLocations.map(angle => {
      return [
        Math.cos(angle) * width / 2.5 + width / 2,
        Math.sin(angle) * width / 2.5 + width / 2,
      ]
    })
    zip(bodyPoints, ratios).forEach(body => {
      const point = body[0]!
      const ratio = body[1]!
      this.bodies.push(
        this.collisions.createCircle(point[0], point[1], ratio),
      )
    })

    this.startTime = performance.now()
  }

  update (): void {
    this.collisions.update()

    let locks = 0

    this.bodies.forEach(body => {
      const potentials = body.potentials()

      type Touch = {
        magnitude: number
        xDir: number
        yDir: number
        object: "word" | "sentence"
      }

      const touches: Touch[] = []

      potentials.forEach(otherBody => {
        if (body.collides(otherBody, result)) {
          touches.push({
            magnitude: result.overlap,
            xDir: result.overlap_x,
            yDir: result.overlap_y,
            object: isCircle(result.b) ? "word" : "sentence",
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
        (touches.some(touch => touch.object === "sentence") ? 1 : 0) +
        touches.filter(touch => touch.object === "word").length < 2
      ) {
        body.scale *= growth
      } else {
        locks++
      }
    })

    if (locks === this.bodies.length) {
      this.stopPlease = true
      this.endTime = performance.now()
    }

    // Clear the canvas
    this.context.fillStyle = "#000000"
    this.context.fillRect(0, 0, width, height)

    // Render the bodies
    this.context.strokeStyle = "#FFFFFF"
    this.context.beginPath()
    this.collisions.draw(this.context)
    this.context.stroke()

    // Render the BVH
    if (this.wantsBvh) {
      this.context.strokeStyle = "#00FF00"
      this.context.beginPath()
      this.collisions.drawBVH(this.context)
      this.context.stroke()
    }
  }
}

function random (min: number, max: number): number {
  return Math.floor(Math.random() * max) + min
}

function isCircle (body: Body): body is Circle {
  return "radius" in body
}
