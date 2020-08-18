import Vue from "vue"
import Vuex from "vuex"
import { setWith } from "lodash"

import { State } from '@/types/state'
import { tokeniseSentence } from '@/functions/tokenise'
import { drawTokenisedInput } from '@/functions/draw'
import { fixBoundingBox } from '@/functions/box'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    text: "",
    alphabets: {},
    phrases: [],
    settings: {
      splits: [ "\n\n", "\n", " " ],
      selectedAlphabets: ["base", "Sherman", "ShermanVowels"],
      structure: "Automatic",
      scaling: true, // sentence size scaling
      watermark: true,
      debug: false,
      automatic: true,
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
        buffer: { letter: 0.5, phrase: 0.3 },
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
      fixBoundingBox()
    },
    modifyInput(state: State, newInput: string) {
      state.text = newInput
    },
    modifySingleSetting(state: State, { prop, value }) {
      setWith(state, prop, value, (nsValue, key, nsObject) => {
        return Vue.set(nsObject, key, nsValue)
      })
    },
  },
  actions: {
    updateInputText({ commit }, inputText: string) {
      commit("modifyInput", inputText)
      commit("transliterate")
    },
    updateSingleSetting({ commit }, { prop, value }) {
      prop = `settings.${prop}`
      commit("modifySingleSetting", { prop, value })
      commit("transliterate")
    },
  },
})

