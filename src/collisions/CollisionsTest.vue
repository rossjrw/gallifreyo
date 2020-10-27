<template>
  <div id="app">
    <div>
      <label>
        <input type="checkbox"
               v-model="wantsBvh"
               @change="changeBvh()"
               id="show-bounding-box">
        Show Bounding Volume Hierarchy boxes
      </label>
    </div>
    <div>
      <button @click="reset">
        Reset
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import { GrowingCirclesTest } from '@/collisions/circles'

export default Vue.extend({
  name: "CollisionsTest",
  data() {
    return {
      test: new GrowingCirclesTest(),
      canvas: null as null | HTMLCanvasElement,
      wantsBvh: false,
    }
  },
  methods: {
    changeBvh: function () {
      this.test.wantsBvh = this.wantsBvh
    },
    reset: function () {
      this.test.createCircles()
    }
  },
  mounted() {
    this.canvas = this.test.canvas
    document.getElementById("app")!.appendChild(this.canvas)
  },
})
</script>
