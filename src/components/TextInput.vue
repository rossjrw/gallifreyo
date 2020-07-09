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
        <input class="row col l8 push-l2 s10 push-s1"
               ng-model="host.text"
               ng-change="host.change()">
        <a class="waves-effect waves-light btn row col l6 push-l3 s10 push-s1 center-align"
           ng-click="host.generate()">
          {{host.instant ? "Retransliterate" : "Transliterate"}}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>
