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

interface DebugColours {
  [key: string]: string
}
const debugColours: DebugColours = {
  debug0: "blue",
  debug1: "red",
}

export default Vue.extend({
  name: "RenderedLetter",
  props: ['letter'],
  computed: {
    paths(): Record<string,unknown> {
      return this.letter.paths.map((pathInfo: Path) => {
        let path: Record<string,unknown> = { d: pathInfo.d }
        if (pathInfo.type.startsWith("debug")) {
          path['stroke-width'] = 0.5
          path['stroke'] = debugColours[pathInfo.type]
        }
        return path
      })
    }
  },
})
</script>
