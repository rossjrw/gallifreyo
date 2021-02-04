import "./root.scss"
import Vue from "vue"

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import App from "./components/App.vue"
import store from "./store"

Vue.component("font-awesome-icon", FontAwesomeIcon)

new Vue({ // eslint-disable-line no-new
  el: "#app",
  template: "<App/>",
  components: { App },
  render: h => h(App),
  data: { store },
  mounted () {
    return this.store.modifyInput("Gallifreyo Test")
  },
})
