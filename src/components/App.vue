<template>
  <div id="app">
    <GithubCorner id="github-corner"></GithubCorner>
    <div id="ui"
         class="section">
      <div class="container">
        <Title id="title"
               class="column-part"/>
        <TextInput id="text-input"
                   class="column-part"/>
        <div id="fixed-section"
             class="column-part">
          <div id="force-square">
            <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI=">
            <RenderedImage id="rendered-image"></RenderedImage>
          </div>
          <Downloads id="downloads"></Downloads>
        </div>
        <SettingsOptions id="settings-options"
                         class="column-part"/>
        <Footer id="footer"
                class="column-part"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Downloads from '@/components/Downloads.vue'
import GithubCorner from '@/components/GithubCorner.vue'
import SettingsOptions from '@/components/SettingsOptions.vue'
import RenderedImage from '@/components/RenderedImage.vue'
import TextInput from '@/components/TextInput.vue'
import Title from '@/components/Title.vue'


export default Vue.extend({
  name: "App",
  components: {
    Downloads, GithubCorner, SettingsOptions, RenderedImage, TextInput, Title
  },
})
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all.sass';

body {
  // Background stripes to highlight transparency
  background-image:
    linear-gradient(45deg,
      #eeeeee 25%,
      #f5f5f5 25%,
      #f5f5f5 50%,
      #eeeeee 50%,
      #eeeeee 75%,
      #f5f5f5 75%,
      #f5f5f5 100%
    );
  background-size: 56.57px 56.57px;
  background-attachment: fixed;
}

#github-corner svg {
  // Keep the corner logo on the screen no matter what
  // TODO maybe only do this on desktop
  position: fixed;
}

#force-square {
  // Create a positioning context for the SVG
  position: relative;
}

// The image is a transparent 1px, so guaranteed to be square
#force-square img {
  // Make the image fill the space horizontally to create equal vertical space
  width: 100%;
  height: auto;
}

#rendered-image {
  // Make the SVG fill its square container
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

#ui {
  display: flex;
  flex-direction: column;
  @include tablet {
    max-width: 50%;
    left: 0;
  }
}

#fixed-section {
  @include tablet {
    position: fixed;
    width: 50%;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
