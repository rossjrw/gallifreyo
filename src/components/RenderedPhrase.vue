<template>
  <g :transform="phrase.transform">
    <g v-for="subPhrase in phrase.phrases"
       :key="subPhrase.id">
      <circle cx="0"
              cy="40"
              r="100"/>
      <RenderedLetter v-if="subPhrase.depth === 'letter'"
                      :letter="subPhrase"/>
      <RenderedPhrase v-else
                      :phrase="subPhrase"/>
    </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue"

import RenderedLetter from '@/components/RenderedLetter.vue'

export default Vue.extend({
  name: "RenderedPhrase",
  props: ['phrase'],
  components: {
    RenderedLetter,
  },
})
</script>
