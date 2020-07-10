import Vue from "vue"
import Vuex from "vuex"

import { State } from '@/types'
import { tokeniseSentence } from '@/functions/tokenise'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    text: "Gallifreyo Test",
    alphabets: {},
    tokenisedInput: [],
    renderedInput: [],
    settings: {
      structure: [ "Automatic", "Automatic" ],
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
    },
  } as State,
  mutations: {
    transliterate(state: State) {
      state.tokenisedInput = tokeniseSentence(
        state.text,
        ["\n\n", "\n", " "],
        ["base", "Sherman"], // TODO get selected alphabets
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

