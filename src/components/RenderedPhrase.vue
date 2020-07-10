<template>
  <g :transform="phrase.transform">
    <g v-for="childPhrase in phrase.phrases"
       :key="childPhrase.id">
      <circle cx="0"
              cy="40"
              r="100"/>
      <RenderedPhrase v-if="'phrases' in childPhrase"
                      :phrase="childPhrase"/>
      <RenderedLetter v-else
                      :letter="childPhrase"/>
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
