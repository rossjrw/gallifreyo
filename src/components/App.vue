<template>
  <div id="app">
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
import Corner from '@/components/Corner.vue'
import Header from '@/components/Header.vue'
import InputOutput from '@/components/IO.vue'
import Ruleset from '@/components/Ruleset.vue'
import SaveRules from '@/components/SaveRules.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: "App",
  components: {
    Corner, Footer, Header, InputOutput, Ruleset, SaveRules
  },
}
</script>
