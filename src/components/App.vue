<template>
  <div id="app">
    <GithubCorner id="github-corner"></GithubCorner>
    <div id="ui"
         class="container">
      <Title id="title"></Title>
      <TextInput id="text-input"></TextInput>
      <div id="fixed-section">
        <div id="force-square">
          <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI=">
          <RenderedImage id="rendered-image"></RenderedImage>
        </div>
        <Downloads id="downloads"></Downloads>
      </div>
      <SettingsOptions id="settings-options"></SettingsOptions>
      <Footer id="footer"></Footer>
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

#github-corner svg {
  position: fixed;
}

#force-square img {
  width: 100%;
  height: auto;
}

#rendered-image {
  position: absolute;
}

#ui {
  display: flex;
  flex-direction: column;
  margin: 1rem;
  @include tablet {
    max-width: 50vw;
    margin-right: 50vw;
    margin-left: auto;
  }
}

#fixed-section {
  @include tablet {
    position: fixed;
    height: 100vh;
    width: 50vw;
  }
}
</style>
