<template>
  <div class="card">
    <div class="card-content">

      <p class="title">
      Options
      </p>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            Size scaling
          </label>
        </div>
        <div class="field-body">
          <div class="field has-addons">
            <div class="control">
              <input type="range"
                     class="input"
                     min="0"
                     max="2"
                     step="0.01"
                     v-model.number="sizeScaling">
            </div>
            <div class="control">
              <input type="number"
                     class="input"
                     min="0"
                     max="2"
                     step="0.01"
                     v-model.number="sizeScaling">
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            Algorithm
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="select">
              <div class="control">
                <select v-model="positionAlgorithm">
                  <option>Automatic</option>
                  <option>Radial</option>
                  <option>Organic</option>
                  <option>Spiral</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            Width of image
          </label>
        </div>
        <div class="field-body">
          <div class="field has-addons">
            <div class="control">
              <input type="number"
                     class="input"
                     v-model.number="width">
            </div>
            <div class="control">
              <a class="button is-static">
                px
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">
            Watermark
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <input type="checkbox"
                   v-model="watermark">
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            Foreground
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input type="color"
                     class="input"
                     v-model="foregroundColour">
            </div>
          </div>
          <div class="field has-addons">
            <div class="control">
              <a class="button is-static">
                alpha
              </a>
            </div>
            <div class="control">
              <input type="number"
                     class="input"
                     v-model.number="foregroundAlpha">
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            Background
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input type="color"
                     class="input"
                     v-model="backgroundColour">
            </div>
          </div>
          <div class="field has-addons">
            <div class="control">
              <a class="button is-static">
                alpha
              </a>
            </div>
            <div class="control">
              <input type="number"
                     class="input alpha"
                     v-model.number="backgroundAlpha">
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">
            Debug mode
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <input type="checkbox"
                   v-model="debug">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import { Settings } from "../types/state"
import store from "../store"

export default Vue.extend({
  name: "SettingsOptions",
  data () {
    return { store }
  },
  computed: {
    width: {
      get (): Settings["width"] {
        return this.store.state.settings.width
      },
      set (value: Settings["width"]): void {
        this.store.modifySetting(s => { s.width = value })
      },
    },
    debug: {
      get (): Settings["debug"] {
        return this.store.state.settings.debug
      },
      set (value: Settings["debug"]): void {
        this.store.modifySetting(s => { s.debug = value })
      },
    },
    backgroundColour: {
      get (): Settings["backgroundColour"] {
        return this.store.state.settings.backgroundColour
      },
      set (value: Settings["backgroundColour"]): void {
        this.store.modifySetting(s => { s.backgroundColour = value })
      },
    },
    backgroundAlpha: {
      get (): Settings["backgroundAlpha"] {
        return this.store.state.settings.backgroundAlpha
      },
      set (value: Settings["backgroundAlpha"]): void {
        this.store.modifySetting(s => { s.backgroundAlpha = value })
      },
    },
    foregroundColour: {
      get (): Settings["foregroundColour"] {
        return this.store.state.settings.foregroundColour
      },
      set (value: Settings["foregroundColour"]): void {
        this.store.modifySetting(s => { s.foregroundColour = value })
      },
    },
    foregroundAlpha: {
      get (): Settings["foregroundAlpha"] {
        return this.store.state.settings.foregroundAlpha
      },
      set (value: Settings["foregroundAlpha"]): void {
        this.store.modifySetting(s => { s.foregroundAlpha = value })
      },
    },
    positionAlgorithm: {
      get (): Settings["config"]["positionAlgorithm"] {
        return this.store.state.settings.config.positionAlgorithm
      },
      set (value: Settings["config"]["positionAlgorithm"]): void {
        this.store.modifySetting(s => { s.config.positionAlgorithm = value })
      },
    },
    sizeScaling: {
      get (): Settings["config"]["sizeScaling"] {
        return this.store.state.settings.config.sizeScaling
      },
      set (value: Settings["config"]["sizeScaling"]): void {
        this.store.modifySetting(s => { s.config.sizeScaling = value })
      },
    },
    watermark: {
      get (): Settings["watermark"] {
        return this.store.state.settings.watermark
      },
      set (value: Settings["watermark"]): void {
        this.store.modifySetting(s => { s.watermark = value })
      },
    },
  },
})
</script>

<style lang="scss">
.field-body {
  flex-grow: 2;
}

input[type=color] {
  min-width: 2.5em;
}

input[type=number] {
  max-width: 5.5em;
}
</style>
