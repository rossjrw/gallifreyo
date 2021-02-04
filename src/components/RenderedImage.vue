<template>
  <div id="drawing">
    <svg id="render"
         xmlns="http://www.w3.org/2000/svg"
         height="100%"
         width="100%"
         preserveAspectRatio="none">
      <g stroke-width="1"
         fill="none"
         stroke="black"
         transform="scale(1,-1)">
        <RenderedPhrase v-for="phrase in phrases"
                        :key="phrase.id"
                        :phrase="phrase"/>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import store from "../store"
import { Sentence } from "../classes/Sentence"
import RenderedPhrase from "../components/RenderedPhrase.vue"

export default Vue.extend({
  name: "RenderedImage",
  components: { RenderedPhrase },
  data () {
    return { store }
  },
  computed: {
    phrases: {
      get (): Sentence[] {
        return this.store.state.phrases
      },
    },
  },
})
</script>
