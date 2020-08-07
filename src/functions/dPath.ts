import { Path } from '@/types'

export interface SVGPath {
  d: string
  'stroke-width'?: number
  stroke?: string
}

const debugColours = {
  angle: "blue",
  position: "red",
  circle: "yellow",
}

export function makePaths (
  paths: Path[],
): SVGPath[] {
  /**
   * Converts a list of paths to SVG paths.
   */
  return paths.map((pathInfo: Path) => {
    const path: SVGPath = { d: pathInfo.d }
    if (pathInfo.type === "debug") {
      path['stroke-width'] = 0.5
      if (pathInfo.purpose) {
        path['stroke'] = debugColours[pathInfo.purpose]
      }
    }
    return path
  })
}
