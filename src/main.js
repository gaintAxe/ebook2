import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'

Vue.config.productionTip = false

import '@/assets/styles/icon.css'
import '@/assets/styles/global.scss'

// import './mock'
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('@/assets/images/loading.jpeg'),//加载中图片，一定要有，不然会一直重复加载占位图
  error: require('@/assets/images/loading2.jpeg')  //加载失败图片
});

import './utils/boost'

import './utils/create-api'

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
