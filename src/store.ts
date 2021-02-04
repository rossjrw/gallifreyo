import { State, Settings } from "./types/state"
import { tokeniseSentence } from "./functions/tokenise"
import { drawTokenisedInput } from "./functions/draw"
import { fixBoundingBox } from "./functions/box"

export default {
  state: {
    text: "", // Should only be changed via mutation
    alphabets: {},
    phrases: [],
    settings: {
      splits: ["\n\n", "\n", " "],
      selectedAlphabets: ["base", "Sherman", "ShermanVowels"],
      scaling: true, // sentence size scaling
      watermark: true,
      debug: false,
      automatic: true,
      width: 1024,
      foregroundColour: "#000000",
      foregroundAlpha: 0,
      backgroundColour: "#FFFFFF",
      backgroundAlpha: 1,
      config: {
        s: { height: 0.9, width: 1 },
        p: { height: 1.2, width: 1 },
        d: { height: -0.4, width: 2 },
        f: { height: 0, width: 0.75 },
        v: { height: 2, width: 1, r: 0.1 },
        buffer: { letter: 0.5, word: 0.2, sentence: 0.05 },
        automatic: { scaledLessThan: 6, spiralMoreThan: 9 },
        sizeScaling: 1,
        positionAlgorithm: "Automatic",
      },
    },
  } as State,
  transliterate (): void {
    this.state.phrases = []
    this.state.phrases = drawTokenisedInput(
      tokeniseSentence(
        this.state.text,
        this.state.settings.splits,
        this.state.settings.selectedAlphabets,
        this.state.settings,
      ),
    )
    fixBoundingBox()
  },
  modifyInput (newInput: string): void {
    this.state.text = newInput
    this.transliterate()
  },
  modifySetting (setter: (s: Settings) => void): void {
    setter(this.state.settings)
    this.transliterate()
  },
}
