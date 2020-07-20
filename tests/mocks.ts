import { Settings } from '../src/types'

export const settings: Settings = {
  splits: [ "\n\n", "\n", " " ],
  selectedAlphabets: [ "base", "Sherman" ],
  structure: "Automatic",
  scaling: true, // sentence size scaling
  watermark: true,
  width: 1024,
  foregroundColour: "#000000",
  backgroundColour: "#FFFFFF",
  config: {
    s: { height: 0.9, width: 1 },
    p: { height: 1.2, width: 1 },
    d: { height: -0.4, width: 2 },
    f: { height: 0, width: 0.75 },
    v: { height: 2, width: 1, r: 0.1 },
    word: { height: 1.2, width: 1 },
    buffer: { letter: 0.5, word: 0.5, sentence: 0.5 },
    automatic: { scaledLessThan: 6, spiralMoreThan: 9 },
  },
}
