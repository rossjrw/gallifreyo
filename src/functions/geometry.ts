import { Point } from "../classes/Phrase"

/**
 * Given parameters to form a spiral and select a point on it, returns the
 * coordinates of that point.
 *
 * @param rungWidth - The distance between each rung of the spiral.
 * @param pointSpacing - The distance between points on the spiral.
 * @param totalPoints - The total number of points to draw on the spiral.
 * @param selectedPoint - The index of the point that is selected, starting
 * from the outer edge of the spiral.
 * @param multiplier - A factor to rescale the spiral size.
 * @returns [x, y]: The coordinates of the selected point.
 */
export function getSpiralCoord (
  rungWidth: number,
  pointSpacing: number,
  totalPoints: number,
  selectedPoint: number,
  multiplier = 1,
): number[] {
  // The spiral is drawn starting from the centre. The points need to be
  // plotted starting from the edge, so the index should be inverted
  selectedPoint = totalPoints - selectedPoint

  // Parametric equations to render the spiral
  const x =
    (rungWidth / (2 * Math.PI) *
    Math.sqrt(
      (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI)),
    ) *
    Math.cos(
      Math.sqrt(
        (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI)),
      ) -
      (Math.PI / 2) -
      Math.sqrt(
        (2 * pointSpacing * totalPoints) / (rungWidth / (2 * Math.PI)),
      ),
    ) -
    (rungWidth / 4)
    ) * multiplier

  const y = (
    (rungWidth / (2 * Math.PI)) *
    Math.sqrt(
      (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI)),
    ) *
    Math.sin(
      Math.sqrt(
        (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI)),
      ) +
      (Math.PI / 2) -
      Math.sqrt(
        (2 * pointSpacing * totalPoints) / (rungWidth / (2 * Math.PI)),
      ),
    ) +
    rungWidth / 4
  ) * multiplier

  return [-x, -y]
  // this does need to be multiplied by the multiplier to be usable
  // why are they both negative? I do not know. but it works.
}

/**
 * Calculates the points of intersection of two circles given their
 * coordinates and radii.
 *
 * @param x0 - x-coordinate of the first circle.
 * @param y0 - y-coordinate of the first circle.
 * @param r0 - Radius of the first circle.
 * @param x0 - x-coordinate of the second circle.
 * @param y0 - y-coordinate of the second circle.
 * @param r0 - Radius of the second circle.
 * @returns [x, x, y, y] for the two points of intersection.
 */
export function circleIntersectionPoints (
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number,
): number[] {
  const dx = x1 - x0
  const dy = y1 - y0
  const d = Math.hypot(dy, dx)
  const a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d)
  const x2 = x0 + (dx * a / d)
  const y2 = y0 + (dy * a / d)
  const h = Math.sqrt((r0 * r0) - (a * a))
  const rx = -dy * (h / d)
  const ry = dx * (h / d)
  const xi = x2 + rx
  const xiPrime = x2 - rx
  const yi = y2 + ry
  const yiPrime = y2 - ry
  return [xi, xiPrime, yi, yiPrime]
  // xi is positive, xiPrime is negative for the word-letter situation
}

/**
 * For a given circle and a point on it, find the point that is a certain
 * distance from that point along the circle's circumference.
 *
 * @param centre - The coords of the centre of the circle.
 * @param radius - The radius of the circle.
 * @param point - The initial point on the circle.
 * @param distance - The distance to travel along the circle. Not sure if it's
 * clockwise or anticlockwise; if it's not the one you want, invert it.
 */
export function travelAlongCircle (
  centre: Point,
  radius: number,
  point: Point,
  distance: number,
): Point {
  const a = centre.x
  const b = centre.y
  const { x, y } = point
  const theta = distance / radius
  return {
    x: a + (x - a) * Math.cos(theta) - (y - b) * Math.sin(theta),
    y: b + (x - a) * Math.sin(theta) + (y - b) * Math.cos(theta),
  }
}

/**
 * Finds the angle between two points relative to a centre point.
 *
 * @param a - A point.
 * @param b - The centre point.
 * @param c - The other point.
 */
export function findAngle (a: Point, b: Point, c: Point): number {
  const ab = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
  const bc = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2))
  const ac = Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2))
  return Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab))
}
