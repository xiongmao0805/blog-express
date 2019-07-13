// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from '@/store';
import { myaxios, mylayer, Validate } from '@/resource/js/plugin.js';

Vue.config.productionTip = false;

// 注册表单验证
Vue.use(Validate, {
  locale: 'zh_CN',
  events: 'blur',
  strict: true
});   

// 注册弹窗组件
Vue.prototype.$layer = function (options) {
  return mylayer(options);
}
// 注册ajax
Vue.prototype.$ajax = function (options) {
  return myaxios(options);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
