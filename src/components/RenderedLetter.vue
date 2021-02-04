<template>
  <g :transform="letter.transform">
    <path v-for="(path, index) in paths"
          :key="`path-${index}`"
          v-bind="path">
    </path>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

import store from "../store"
import { makePaths, SVGPath } from "../functions/dPath"
import { Letter } from "../classes/Letter"

export default Vue.extend({
  name: "RenderedLetter",
  props: {
    letter: Object as PropType<Letter>,
  },
  data () {
    return { store }
  },
  computed: {
    paths (): SVGPath[] {
      return makePaths(this.letter.paths, this.store.state.settings.debug)
    },
  },
})
</script>
