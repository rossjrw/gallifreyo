<template>
  <g>
    <g v-for="subphrase in phrase.phrases"
       :key="subphrase.id">
      <path v-for="(path, index) in paths"
            :key="`path-${index}`"
            v-bind="path">
      </path>
      <RenderedLetter v-if="subphrase.depth === 'letter'"
                      :letter="subphrase"/>
      <RenderedPhrase v-else
                      :phrase="subphrase"/>
    </g>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

import store from "../store"
import RenderedLetter from "../components/RenderedLetter.vue"
import { SVGPath, makePaths } from "../functions/dPath"
import { Sentence } from "../classes/Sentence"

export default Vue.extend({
  name: "RenderedPhrase",
  props: {
    phrase: Object as PropType<Sentence>,
  },
  components: {
    RenderedLetter,
  },
  data () {
    return { store }
  },
  computed: {
    paths (): SVGPath[] {
      return makePaths(this.phrase.paths, this.store.state.settings.debug)
    },
  },
})
</script>
