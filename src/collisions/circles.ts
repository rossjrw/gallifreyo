import { Collisions, Circle, Result, Body } from "detect-collisions"
import { range } from "lodash"

const width = 600
const height = width
const count = 50
const speed = 1
const result = new Collisions().createResult()
const circleRes = 12

export class GrowingCirclesTest {
  element: HTMLDivElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  collisions: Collisions
  result: Result
  bodies: Circle[]
  frame: number
  wantsBvh: boolean

  constructor() {
    this.element = document.createElement('div')
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!
    this.collisions = new Collisions()
    this.result = this.collisions.createResult()
    this.bodies = []
    this.wantsBvh = false

    this.canvas.width = width
    this.canvas.height = height

    // Create the containing circle out of lines
    const circlePoints = range(0, circleRes).map(index => {
      const angle = index * 2 * Math.PI / circleRes - Math.PI / 2
      return [
        Math.cos(angle) * width/2 + width/2,
        Math.sin(angle) * width/2 + width/2,
      ]
    })
    circlePoints.forEach((thisPoint, index) => {
      const nextIndex = index == circleRes - 1 ? 0 : index + 1
      const nextPoint = circlePoints[nextIndex]
      this.collisions.createPolygon(0, 0, [thisPoint, nextPoint])
    })

    this.createCircles()

    const nextFrame = () => {
      this.update()
      this.frame = requestAnimationFrame(nextFrame)
    }

    this.frame = requestAnimationFrame(nextFrame)
  }

  createCircles(): void {
    this.bodies = []
    const circleCount = random(2, 8)
    const bodyPoints = range(0, circleCount).map(index => {
      const angle = index * 2 * Math.PI / circleCount - Math.PI / 2
      return [
        Math.cos(angle) * width/3 + width/2,
        Math.sin(angle) * width/3 + width/2,
      ]
    })
    bodyPoints.forEach(point => {
      console.log("circle", point)
      this.bodies.push(
        this.collisions.createCircle(point[0], point[1], random(10, 50))
      )
    })
  }

  update(): void {
    this.bodies.forEach(body => {
      // body.scale *= 1.01
    })

    this.collisions.update()

    this.bodies.forEach(body => {
      const potentials = body.potentials()

      type Touch = {
        magnitude: number
        xDir: number
        yDir: number
        object: 'word' | 'sentence'
      }

      const touches: Touch[] = []

      potentials.forEach(otherBody => {
        if (body.collides(otherBody, result)) {
          touches.push({
            magnitude: result.overlap,
            xDir: result.overlap_x,
            yDir: result.overlap_y,
            object: isCircle(result.b) ? 'word' : 'sentence',
          })
          // body.x -= result.overlap * result.overlap_x
          // body.y -= result.overlap * result.overlap_y
        }
      })
      touches.forEach(touch => {
        if (touches.length < 3) {
          body.x -= touch.magnitude * touch.xDir
          body.y -= touch.magnitude * touch.yDir
        }
      })
      if (touches.length < 2) {
        body.scale *= 1.01
      }
    })

    // Clear the canvas
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, width, height)

    // Render the bodies
    this.context.strokeStyle = '#FFFFFF'
    this.context.beginPath()
    this.collisions.draw(this.context)
    this.context.stroke()

    // Render the BVH
    if (this.wantsBvh) {
      this.context.strokeStyle = '#00FF00'
      this.context.beginPath()
      this.collisions.drawBVH(this.context)
      this.context.stroke()
    }
  }
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min
}

function isCircle(body: Body): body is Circle {
  return 'radius' in body
}
