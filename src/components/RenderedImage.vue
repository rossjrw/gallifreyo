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
             ng-repeat="sentence in host.paragraph.sentences">
            <circle cx="0"
                    cy="40"
                    r="100"/>
            <g level="word"
                ng-repeat="word in sentence.words">
              <g level="letter"
                 ng-attr-transform="{{word.transform}}"
                 ng-repeat="letter in word.letters">
                <path ng-attr-d="{{letter.d}}"
                      ng-attr-transform="{{letter.transform}}">
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
