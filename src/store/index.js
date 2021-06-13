import Vue from 'vue'
import Vuex from 'vuex'
import theme from './module/theme'
import admin from './module/admin'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    theme,
    admin
  }
})
