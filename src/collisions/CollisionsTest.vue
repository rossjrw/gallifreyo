<template>
  <div id="app">
    <div>
      <label>
        <input type="checkbox"
               v-model="wantsBvh"
               @change="changeBvh()">
        Show Bounding Volume Hierarchy boxes
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox"
               v-model="instant"
               @change="changeInstant()">
        Instant mode
      </label>
    </div>
    <div>
      <button @click="reset">
        Reset
      </button>
    </div>
    <div>
      <p>Took {{time}}ms</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import { GrowingCirclesTest } from "../collisions/circles"

export default Vue.extend({
  name: "CollisionsTest",
  data () {
    return {
      test: new GrowingCirclesTest(),
      canvas: null as null | HTMLCanvasElement,
      wantsBvh: false,
      instant: false,
    }
  },
  computed: {
    time: {
      get (): number { return this.test.endTime - this.test.startTime },
    },
  },
  methods: {
    changeBvh: function () {
      this.test.wantsBvh = this.wantsBvh
    },
    changeInstant: function () {
      this.test.instant = this.instant
    },
    reset: function () {
      this.test.createCircles()
      this.test.nextFrame()
    },
  },
  mounted () {
    this.canvas = this.test.canvas
    document.getElementById("app")!.appendChild(this.canvas)
  },
})
</script>
