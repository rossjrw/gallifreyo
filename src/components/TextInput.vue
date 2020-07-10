<template>
  <div class="card white">
    <div class="card-content black-text">
      <span class="card-title">
        Text to translate
      </span>
      <p>
        Use the spacebar to separate words. Use a full-stop to separate
        sentences.
      </p>
      <div class="row input-field">
        <textarea class="row col l8 push-l2 s10 push-s1"
                  v-model="text">
        </textarea>
        <a class="waves-effect waves-light btn row col l6 push-l3 s10 push-s1 center-align"
           ng-click="host.generate()">
          Retransliterate
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "TextInput",
  computed: {
    text: {
      get(): string {
        return this.$store.state.text
      },
      set(text: string): void {
        this.$store.dispatch("updateInputText", text)
      },
    },
  },
})
</script>
