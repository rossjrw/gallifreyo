<template>
  <div class="card">
    <div class="card-content">

      <p class="title">
      Options
      </p>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">
            Automatic translation
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <input type="checkbox"
                   v-model="automatic">
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            Structure
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="select">
              <div class="control">
                <select v-model="structure">
                  <option>Simple</option>
                  <option>Size-Scaled</option>
                  <option>Spiral</option>
                  <option>Automatic</option>
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
                     v-model="width">
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
            <div class="control">
              <input type="color"
                     class="input"
                     v-model="foregroundColour">
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
            <div class="control">
              <input type="color"
                     class="input"
                     v-model="backgroundColour">
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
import { mapActions } from "vuex"

export default Vue.extend({
  name: "SettingsOptions",
  methods: {
    ...mapActions({ setting: 'updateSingleSetting' })
  },
  computed: {
    automatic: {
      get() { return this.$store.state.settings.automatic },
      set(value) { this.setting({ prop: 'automatic', value }) },
    },
    structure: {
      get() { return this.$store.state.settings.structure },
      set(value) { this.setting({ prop: 'structure', value }) },
    },
    width: {
      get() { return this.$store.state.settings.width },
      set(value) { this.setting({ prop: 'width', value }) },
    },
    watermark: {
      get() { return this.$store.state.settings.watermark },
      set(value) { this.setting({ prop: 'watermark', value }) },
    },
    foregroundColour: {
      get() { return this.$store.state.settings.foregroundColour },
      set(value) { this.setting({ prop: 'foregroundColour', value }) },
    },
    backgroundColour: {
      get() { return this.$store.state.settings.backgroundColour },
      set(value) { this.setting({ prop: 'backgroundColour', value }) },
    },
    debug: {
      get() { return this.$store.state.settings.debug },
      set(value) { this.setting({ prop: 'debug', value }) },
    },
  }
})
</script>

<style lang="scss">
.field-body {
  flex-grow: 2;
}
</style>
