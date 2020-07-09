<template>
  <div id="app">
    <GithubCorner></GithubCorner>
    <body class="grey lighten-2">
      <div class="container">
        <div class="row" style="margin-bottom: 0;">

          <div class="col P12 L6"> <!-- this is the scrolly column on the left -->
            <Title></Title>

            <!-- START INPUT CARD -->
            <TextInput></TextInput>
            <!-- END INPUT CARD -->

            <display-svg class="hide-on-landscape"></display-svg>
            <downloads class="hide-on-landscape"></downloads>

            <!-- START OPTIONS CARD -->
            <Options></Options>
            <!-- END OPTIONS CARD -->

            <!-- START donate nagger -->
            <Footer></Footer>
            <!-- END donate nagger -->

          </div>

          <div class="col P12 L6 hide-on-portrait valign-wrapper" style="height: 100vh;">
            <div class="targset" style="width: 35%; position: fixed;">
              <!-- START IMAGE CARD -->
              <RenderedImage></RenderedImage>
              <!-- END IMAGE CARD -->

              <!-- START DOWNLOAD CARD -->
              <Downloads></Downloads>
              <!-- END DOWNLOAD CARD -->
            </div>
          </div>
        </div>
      </div>
    </body>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Downloads from '@/components/Downloads.vue'
import GithubCorner from '@/components/GithubCorner.vue'
import Options from '@/components/Options.vue'
import RenderedImage from '@/components/RenderedImage.vue'
import TextInput from '@/components/TextInput.vue'
import Title from '@/components/Title.vue'


export default Vue.extend({
  name: "App",
  components: {
    Downloads, GithubCorner, Options, RenderedImage, TextInput, Title
  },
})
</script>
