/* eslint-disable no-unused-vars */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局css
import global from '@/utils/global' // 全局常量

Vue.prototype.GLOBAL = global

import App from './App'
import store from './store'
import router from './router'
import Vuerify from 'vuerify'
import 'lib-flexible/flexible.js'

// get和post请求
import { postRequest, getRequest, putRequest, deleteRequest } from '@/utils/request'

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest

import { filePreview, picsPreview, fuzzySearch, depClone, parseTime, dialogClosed, resetForm } from '@/utils'
Vue.prototype.filePreview = filePreview // 文件预览全局方法
Vue.prototype.picsPreview = picsPreview // 照片预览全局方法
Vue.prototype.fuzzySearch = fuzzySearch // 模糊搜索全局方法
Vue.prototype.depClone = depClone // 深拷贝全局方法
Vue.prototype.parseTime = parseTime // 日期转换全局方法
Vue.prototype.dialogClosed = dialogClosed // 弹窗关闭全局方法
Vue.prototype.resetForm = resetForm // 重置清空表单全局方法

// 弹出框
import { handleCofirm, handleAlert } from '@/utils/messageBox'

Vue.prototype.handleCofirm = handleCofirm
Vue.prototype.handleAlert = handleAlert

// 全局组件
import globalUI from '@/components'
Vue.use(globalUI)

// 全局过滤器
import filters from '@/filtres'
Vue.use(filters)

// 全局指令
import directive from '@/directive'
Vue.use(directive)

Vue.use(Vuerify, {
  required: {
    test: /\S+$/,
    message: '必填项'
  }
})
import '@/icons' // icon
import '@/permission' // permission control
// 百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'sCrmUchPh7eKuHSyuZKx0e1acqyk7REF'
})

// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

import mixin from '@/mixins'
Vue.mixin(mixin)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
