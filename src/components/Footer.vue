<template>
  <footer class="card">
    <div class="card-content content has-text-centered">
      <p>
      <strong>Gallifreyo</strong> v{{version}}
      by <a href="https://github.com/rossjrw">Ross Williams</a>.
      </p>
      <p>
      The
      <a href="https://github.com/rossjrw/gallifreyo">source code</a>
      is licensed
      <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL 3.0</a>.
      </p>
      <p class="level">
      <a href="https://bulma.io"
         class="level-item">
        <img src="https://bulma.io/images/made-with-bulma--semiblack.png"
             alt="Made with Bulma"
             width="128"
             height="24">
      </a>
      <a href='https://ko-fi.com/I3I41R5OU'
         target='_blank'
         class="level-item">
        <img height='36'
             style='border:0px;height:36px;'
             src='https://cdn.ko-fi.com/cdn/kofi5.png?v=2'
             border='0'
             alt='Buy Me a Coffee at ko-fi.com'/>
      </a>
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
// Defined in webpack config
declare const __VERSION__: string

import Vue from "vue"

export default Vue.extend({
  name: "Title",
  data() {
    return {
      version: __VERSION__,
    }
  }
})
</script>

<style lang="scss">
// Make the footer a little thinner, and centre it
footer {
  width: 80%;
  margin-right: auto;
  margin-left: auto;
}
</style>
