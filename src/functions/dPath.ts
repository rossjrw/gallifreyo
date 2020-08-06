import { Path } from '@/types'

interface DebugColours {
  [key: string]: string
}

export interface SVGPath {
  d: string
  'stroke-width'?: number
  stroke?: string
}

const debugColours: DebugColours = {
  debug0: "blue",
  debug1: "red",
  debug2: "green",
}

export function makePaths (
  paths: Path[],
): SVGPath[] {
  /**
   * Converts a list of paths to SVG paths.
   */
  return paths.map((pathInfo: Path) => {
    const path: SVGPath = { d: pathInfo.d }
    if (pathInfo.type.startsWith("debug")) {
      path['stroke-width'] = 0.5
      path['stroke'] = debugColours[pathInfo.type]
    }
    return path
  })
}
