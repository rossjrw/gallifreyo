import { Collisions, Circle, Result } from "detect-collisions"
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

    const nextFrame = () => {
      this.update()
      this.frame = requestAnimationFrame(nextFrame)
    }

    this.frame = requestAnimationFrame(nextFrame)
  }

  update(): void {
    this.collisions.update()

    this.bodies.forEach(body => {
      body.x += body.direction_x * speed
      body.y += body.direction_y * speed

      const potentials = body.potentials()

      for (const body2 of potentials) {
        if (body.collides(body2, result)) {
          body.x -= result.overlap * result.overlap_x
          body.y -= result.overlap * result.overlap_y

          let dot = body.direction_x * result.overlap_y + body.direction_y * -result.overlap_x

          body.direction_x = 2 * dot * result.overlap_y - body.direction_x
          body.direction_y = 2 * dot * -result.overlap_x - body.direction_y

          dot = body2.direction_x * result.overlap_y + body2.direction_y * -result.overlap_x

          body2.direction_x = 2 * dot * result.overlap_y - body2.direction_x
          body2.direction_y = 2 * dot * -result.overlap_x - body2.direction_y
        }
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
