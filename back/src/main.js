// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from '@/store';
import { xm_ajax, xm_layer, xm_validate } from '@/resource/js/xm_control.js';

Vue.config.productionTip = false;
xm_validate(Vue);     // 注册表单验证

// 注册ajax
Vue.prototype.$ajax = function (options) {
  return xm_ajax(Vue, options);
}
// 注册弹窗组件
Vue.prototype.$layer = function (options) {
  return xm_layer(Vue, options);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
