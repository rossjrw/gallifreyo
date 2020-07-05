import Vue from "vue"
import Vuex from "vuex"

import { State } from './types'
/* import { execute } from './replace' */

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    inputText: "",
    alphabets: [],
  } as State,
  mutations: {
    transliterate(state: State) {
      /* state.outputText = execute(state.inputText, state.rules) */
    },
    modifyInput(state: State, newInput: string) {
      state.inputText = newInput
    },
    // TODO mutation to change 'debug' settings
  },
  actions: {
    initialState({ commit }, inputText: string) {
      commit("modifyInput", inputText)
      commit("transliterate")
    },
    updateInputText({ commit }, inputText: string) {
      commit("modifyInput", inputText)
      commit("transliterate")
    },
  },
})

