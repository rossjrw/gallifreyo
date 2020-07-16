<template>
  <path :d="letter.d"
        :transform="letter.transform">
  </path>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "RenderedLetter",
  props: ['letter'],
})
</script>
