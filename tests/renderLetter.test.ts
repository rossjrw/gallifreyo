import { circleIntersectionPoints } from '../src/functions/render/letter'

describe("circle intersection calculator", () => {
  it("calculates intersection points", () => {
    const coords = circleIntersectionPoints(0, 0, 13, 10, 0, 13)
    expect(coords).toStrictEqual([5, 5, 12, -12])
  })
})
