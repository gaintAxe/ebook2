import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { book } from './modules/book/index'
import { getters } from './getters'
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    book
  }, getters: {
    ...getters
  }
})
