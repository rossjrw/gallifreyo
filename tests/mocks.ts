import { Settings } from '../src/types'

export const settings: Settings = {
  splits: [ "\n\n", "\n", " " ],
  structure: "Automatic",
  scaling: true, // sentence size scaling
  watermark: true,
  width: 1024,
  foregroundColour: "#000000",
  backgroundColour: "#FFFFFF",
  config: {
    s: { b: 0.9, a: 1 },
    p: { b: 1.2, a: 1 },
    d: { b: -0.4, a: 2 },
    f: { b: 0, a: 0.75 },
    v: { b: 2, a: 1, r: 0.1 },
    word: { b: 1.2, a: 1 },
    buffer: { letter: 0.5, word: 0.5, sentence: 0.5 },
    automatic: { scaledLessThan: 6, spiralMoreThan: 9 },
  },
}
