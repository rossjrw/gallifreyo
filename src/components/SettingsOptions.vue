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
            <input type="checkbox">
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            Language
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="select">
              <div class="control">
                <select>
                  <option>Sherman's Gallifreyan</option>
                </select>
              </div>
            </div>
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
                <select>
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
                     class="input">
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
            <input type="checkbox">
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
                     class="input">
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
                     class="input">
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>

<style lang="scss">
.field-body {
  flex-grow: 2;
}
</style>
