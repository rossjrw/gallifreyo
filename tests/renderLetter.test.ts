import { circleIntersectionPoints } from '../src/functions/geometry'

describe("circle intersection calculator", () => {
  it("calculates intersection points", () => {
    const coords = circleIntersectionPoints(0, 0, 13, 10, 0, 13)
    expect(coords).toStrictEqual([5, 5, 12, -12])
  })
  it("returns NaN when intersection fails", () => {
    const coords = circleIntersectionPoints(0, 0, 1, 10, 0, 1)
    expect(coords).toStrictEqual([NaN, NaN, NaN, NaN])
  })
})
