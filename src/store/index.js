import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { book } from './modules/book/index'
import { home } from './modules/home/index'
import { getters } from './getters'
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    book, home
  }, getters: {
    ...getters
  }
})
