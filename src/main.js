// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入样式
// 引入element-ui自定义的主题
import '../theme/index.css'
// 引入插件及组件
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './vuex/store'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts' // 引入echarts

Vue.prototype.$echarts = echarts // 引入组件
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
