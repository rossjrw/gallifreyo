import { compress } from "compress-tag"

import { Path } from '../types/phrases'
import { Settings } from '../types/state'
import { Sentence } from '../classes/Sentence'

type Point = { x: number, y: number }
type Intent = {
  type: 'default' | 'debug'
  purpose?: 'angle' | 'position' | 'circle'
}

export abstract class TextNode {
  /**
   * Base class for all written nodes.
   */
  id: number
  settings: Settings
  angularLocation?: number
  paths: Path[]

  constructor (id: number, settings: Settings) {
    this.id = id
    this.settings = settings
    this.paths = []
  }

  drawCircle (
    centre: Point,
    radius: number,
    intent: Intent = { type: 'default'},
  ): void {
    /**
     * Draw a circle of a radius around a point.
     */
    const path = compress`
      M ${centre.x} ${centre.y}
      m -${radius} 0
      a ${radius} ${radius} 0 1 1 ${2 * radius} 0
      a ${radius} ${radius} 0 1 1 ${-2 * radius} 0`
    this.paths.push({ d: path, ...intent })
  }

  drawArc (
    from: Point,
    to: Point,
    radius: number,
    { largeArc, sweep }: { largeArc: boolean, sweep: boolean },
    intent: Intent = { type: 'default'},
  ): void {
    /**
     * Draw a curve between two points of known radius.
     */
    const path = compress`
      M ${from.x} ${from.y}
      A ${radius} ${radius} 0 ${largeArc ? "1" : "0"} ${sweep ? "1" : "0"}
        ${to.x} ${to.y}`
    this.paths.push({ d: path, ...intent })
  }

  drawLine (
    from: Point,
    to: Point,
    intent: Intent = { type: 'default'},
  ): void {
    /**
     * Draw a line between two points.
     */
    const path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`
    this.paths.push({ d: path, ...intent })
  }
}

export abstract class Phrase extends TextNode {
  /**
   * Base class for sentences and words.
   */
  relativeAngularSize?: number
  absoluteAngularSize?: number
  x: number
  y: number
  bufferRadius: number
  radius: number

  constructor (id: number, settings: Settings) {
    super(id, settings)
    // Initial geometry values, may be overridden later
    this.x = 0
    this.y = 0
    this.bufferRadius = 100
    this.radius = 100
  }

  addAngularLocation (parent: Sentence, index: number): void {
    /**
     * Set the angular location of this subphrase based on its position in the
     * parent phrase.
     *
     * Used for positioning in the Radial and Organic algorithms.
     *
     * @param parent: The sentence that contains this phrase.
     * @param index: The index of this letter in the word.
     */
    this.angularLocation = (
      parent.phrases.slice(0, index + 1).reduce(
        (total, phrase) => {
          return total + phrase.absoluteAngularSize!
        }, 0
      )
      - (parent.phrases[0].absoluteAngularSize! / 2)
      - (this.absoluteAngularSize! / 2)
    )
  }
}
