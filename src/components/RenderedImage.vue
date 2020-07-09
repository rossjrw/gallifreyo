<template>
  <div id="drawing">
    <svg id="render"
         xmlns="http://www.w3.org/2000/svg"
         height="100%"
         width="100%"
         preserveAspectRatio="none">
      <g stroke-width="1"
         fill="none"
         stroke="black"
         transform="scale(1,-1)"> <!-- not wrong way around -->
        <g level="paragraph">
          <g level="sentence"
             v-for="sentence in host.paragraph.sentences"
             :key="sentence.id"> <!-- TODO property doesn't exist -->
            <circle cx="0"
                    cy="40"
                    r="100"/>
            <g level="word"
               v-for="word in sentence.words"
               :key="word.id">
              <g level="letter"
                 :transform="word.transform"
                 v-for="letter in word.letters"
                 :key="letter.id">
                <path :d="letter.d"
                      :transform="letter.transform">
                </path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>
