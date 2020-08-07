<template>
  <div id="app">
    <GithubCorner id="github-corner"/>
    <div id="ui"
         class="section">
      <div class="buffer">
        <div class="column-part">
          <Title id="title"/>
        </div>
        <div class="column-part">
          <TextInput id="text-input"/>
        </div>
        <div class="column-part">
          <div id="fixed-section">
            <div id="force-square">
              <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI=">
              <RenderedImage id="rendered-image"/>
            </div>
            <Downloads id="downloads"/>
          </div>
        </div>
        <div class="column-part">
          <SettingsOptions id="settings-options"/>
        </div>
        <div class="column-part">
          <Footer id="footer"/>
        </div>
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
@import '~bulma/sass/layout/section.sass';

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

.card {
  border-radius: 1rem;
  margin-top: 1rem;
}

#github-corner svg {
  // Keep the corner logo on the screen no matter what
  // TODO maybe only do this on desktop
  @include tablet {
    position: fixed;
  }
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
}

$section-side-padding: nth($section-padding, 2);
$downloads-box-height: 5.5rem;
$maximum-column-width: 40rem;

// No buffer at mobile
$buffer-width-mobile: 0px;
// Buffer when the screen is too flat to hold a square
$buffer-width-flat: calc(50vw - 100vh - #{$downloads-box-height});
// Buffer when content exceeds 1200px
$buffer-width-maxwidth: calc(50vw - #{$maximum-column-width});
// The actual buffer is the largest of these
$buffer-width: calc(max(
  #{$buffer-width-mobile},
  #{$buffer-width-flat},
  #{$buffer-width-maxwidth}
));

.buffer {
  /*
  The left and right margins of the UI are only present when the screen is too
  flat to accomodate the height of the square image and the downloads box
  underneath it, but wide enough that it is using the two-column layout.
  */
  // calc is needed here to bypass SCSS max function (sass/sass#2378)
  margin: 0 $buffer-width;
}

.column-part {
  @include tablet {
    // Stuff in the two-column layout should be half-width
    width: 50%;
  }
}

#fixed-section {
  @include tablet {
    padding: 1.5rem;
    position: fixed;
    top: 50%;
    right: $buffer-width;
    transform: translateY(-50%);
    width: calc(min(
      100vh - #{$downloads-box-height},
      50vw - #{$section-side-padding},
      #{$maximum-column-width}
    ));
  }
}
</style>
