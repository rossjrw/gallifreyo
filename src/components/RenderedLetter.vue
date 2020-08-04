<template>
  <g :transform="letter.transform">
    <path v-for="(path, index) in paths"
          :key="`path-${index}`"
          v-bind="path">
    </path>
  </g>
</template>

<script lang="ts">
import Vue from "vue"

import { makePaths } from '@/functions/dPath'

export default Vue.extend({
  name: "RenderedLetter",
  props: ['letter'],
  computed: {
    paths() {
      return makePaths(this.letter.paths)
    }
  },
})
</script>
