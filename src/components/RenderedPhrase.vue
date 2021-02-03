<template>
  <g :transform="phrase.transform">
    <g v-for="subPhrase in phrase.phrases"
       :key="subPhrase.id">
      <path v-for="(path, index) in paths"
            :key="`path-${index}`"
            v-bind="path">
      </path>
      <RenderedLetter v-if="subPhrase.depth === 'letter'"
                      :letter="subPhrase"/>
      <RenderedPhrase v-else
                      :phrase="subPhrase"/>
    </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue"

import RenderedLetter from '../components/RenderedLetter.vue'
import { SVGPath, makePaths } from '../functions/dPath'

export default Vue.extend({
  name: "RenderedPhrase",
  props: ['phrase'],
  components: {
    RenderedLetter,
  },
  computed: {
    paths(): SVGPath[] {
      return makePaths(this.phrase.paths, this.$store.state.settings.debug)
    },
  },
})
</script>
