export function getSpiralCoord(
  rungWidth: number,
  pointSpacing: number,
  totalPoints: number,
  selectedPoint: number,
  multiplier = 1,
): number[] {
  /**
   * Given parameters to form a spiral and select a point on it, returns the
   * coordinates of that point.
   *
   * @param rungWidth: The distance between each rung of the spiral.
   * @param pointSpacing: The distance between points on the spiral.
   * @param totalPoints: The total number of points to draw on the spiral.
   * @param selectedPoint: The index of the point that is selected, starting
   * from the outer edge of the spiral.
   * @param multiplier: A factor to rescale the spiral size.
   * @returns [x, y]: The coordinates of the selected point.
   */
  // The spiral is drawn starting from the centre. The points need to be
  // plotted starting from the edge, so the index should be inverted
  selectedPoint = totalPoints - selectedPoint

  // Parametric equations to render the spiral
  const x =
    (rungWidth / (2 * Math.PI)
     *
    Math.sqrt(
      (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
    )
    *
    Math.cos(
      Math.sqrt(
        (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
      ) -
      (Math.PI/2) -
      Math.sqrt(
        (2 * pointSpacing * totalPoints) / (rungWidth / (2 * Math.PI))
      )
    ) -
    (rungWidth / 4)
  ) * multiplier

  const y = (
    (rungWidth / (2 * Math.PI))
    *
    Math.sqrt(
      (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
    )
    *
    Math.sin(
      Math.sqrt(
        (2 * pointSpacing * selectedPoint) / (rungWidth / (2 * Math.PI))
      ) +
      (Math.PI/2) -
      Math.sqrt(
        (2 * pointSpacing * totalPoints) / (rungWidth / (2 * Math.PI))
      )
    ) +
    rungWidth/4
  ) * multiplier

  return [-x, -y]
  // this does need to be multiplied by the multiplier to be usable
  // why are they both negative? I do not know. but it works.
}

export function circleIntersectionPoints(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number,
): number[] {
  /**
   * Calculates the points of intersection of two circles given their
   * coordinates and radii.
   * @param x0: x-coordinate of the first circle.
   * @param y0: y-coordinate of the first circle.
   * @param r0: Radius of the first circle.
   * @param x0: x-coordinate of the second circle.
   * @param y0: y-coordinate of the second circle.
   * @param r0: Radius of the second circle.
   * @returns [x, x, y, y] for the two points of intersection.
   */
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
  const xi_prime = x2 - rx
  const yi = y2 + ry
  const yi_prime = y2 - ry
  return [xi, xi_prime, yi, yi_prime]
  // xi is positive, xi_prime is negative for the word-letter situation
}
