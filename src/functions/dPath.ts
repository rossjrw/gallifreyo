import { Path } from '../types/phrases'

export interface SVGPath {
  d: string
  'stroke-width'?: number
  stroke?: string
}

const debugPurposes = {
  angle: { colour: "blue", priority: 10 },
  position: { colour: "red", priority: 20 },
  circle: { colour: "limegreen", priority: 0 },
}

export function makePaths (
  paths: Path[],
  debug: boolean,
): SVGPath[] {
  /**
   * Converts a list of paths to SVG paths.
   */
  // Put default paths on top of debug paths
  paths = [...paths].sort((a, b) => {
    // Default always comes first
    if (a.type === "default") return 1
    if (b.type === "default") return -1
    if (debugPurposes[a.purpose!].priority >
        debugPurposes[b.purpose!].priority) {
      return -1
    } else {
      return 1
    }
  })
  // Parse debug paths
  return paths.filter((pathInfo: Path) => {
    return debug || pathInfo.type !== 'debug'
  }).map((pathInfo: Path) => {
    const path: SVGPath = { d: pathInfo.d }
    if (pathInfo.type === "debug") {
      path['stroke-width'] = 0.5
      if (pathInfo.purpose) {
        path['stroke'] = debugPurposes[pathInfo.purpose].colour
      }
    }
    return path
  })
}
