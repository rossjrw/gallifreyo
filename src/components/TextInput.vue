<template>
  <div class="card">
    <div class="card-content">
      <p class="title">
      Text to translate
      </p>
      <p class="subtitle">
      Use a space to separate words.
      Use a newline to separate sentences.
      Use two to separate paragraphs.
      </p>
      <div class="field is-horizontal">
        <textarea class="textarea"
                  placeholder="Text to translate"
                  v-model="text">
        </textarea>
      </div>
      <div class="field is-horizontal"
           style="justify-content: flex-end;">
        <a class="button">
          Translate
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import store from "../store"

export default Vue.extend({
  name: "TextInput",
  data () {
    return { store }
  },
  computed: {
    text: {
      get (): typeof store.state.text {
        return this.store.state.text
      },
      set (value: typeof store.state.text): void {
        this.store.modifyInput(value)
      },
    },
  },
})
</script>
