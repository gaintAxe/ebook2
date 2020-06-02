import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'

Vue.config.productionTip = false

import '@/assets/styles/icon.css'
import '@/assets/styles/global.scss'

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
