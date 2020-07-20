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

import { Path } from '@/types'

export default Vue.extend({
  name: "RenderedLetter",
  props: ['letter'],
  computed: {
    paths(): Record<string,unknown> {
      return this.letter.paths.map((pathInfo: Path) => {
        let path: Record<string,unknown> = { d: pathInfo.d }
        if (pathInfo.type === "debug") {
          path['stroke-width'] = 0.5
          path['stroke'] = "blue"
        }
        return path
      })
    }
  },
})
</script>
