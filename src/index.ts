import './root.scss'
import Vue from "vue"

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import store from './store'

Vue.component('font-awesome-icon', FontAwesomeIcon)

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  render: h => h(App),
  store,
  mounted() {
    /* this.$store.dispatch("initialRules", getDataFromUrl(location.search)) */
  }
})
