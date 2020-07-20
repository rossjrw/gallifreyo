import Vue from "vue"
import Vuex from "vuex"

import { State } from '@/types'
import { tokeniseSentence } from '@/functions/tokenise'
import { drawTokenisedInput } from '@/functions/draw'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    text: "Gallifreyo Test",
    alphabets: {},
    phrases: [],
    settings: {
      splits: [ "\n\n", "\n", " " ],
      selectedAlphabets: ["base", "Sherman", "ShermanVowels"],
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
    },
  } as State,
  mutations: {
    transliterate(state: State) {
      state.phrases = []
      state.phrases = drawTokenisedInput(
        tokeniseSentence(
          state.text,
          state.settings.splits,
          state.settings.selectedAlphabets,
        ),
        state.settings
      )
    },
    modifyInput(state: State, newInput: string) {
      state.text = newInput
    },
    // TODO mutation to change 'debug' settings
  },
  actions: {
    updateInputText({ commit }, inputText: string) {
      commit("modifyInput", inputText)
      commit("transliterate", inputText)
    },
  },
})

