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
      <button>
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
    }
  },
  mounted() {
    this.canvas = this.test.canvas
    document.getElementById("app")!.appendChild(this.canvas)
  },
})
</script>
