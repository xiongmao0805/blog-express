// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import axios from 'axios'
import layer from 'vue-layer'
import Validate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'

Vue.config.productionTip = false
Vue.prototype.$ajax = axios           //ajax
Vue.prototype.$layer = layer(Vue)     //弹窗

// 表单验证
// 自定义验证规则
Validator.extend('mobile', {
  getMessage: (field, params, data) => {
    return data.message;
  },
  validate: value => {
    return /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(value);
  }
});
// 自定义错误提示
const dictionary = {
  zh_CN: {
    messages: {
      required: (field) => field + ' 不可为空',
      min: (field, leng) => field + '不得少于' + leng + '位字符',
      max: (field, leng) => field + '不得多于' + leng + '位字符',
      regex: function (field) {
        switch (field) {
          default:
            return field + '不合法';
        }
      },
      mobile: () => '无效的手机号码',
      email: () => '邮箱格式不正确',
      url: () => '无效的链接地址'
    }
  }
};
Validator.localize(dictionary);
const config = {
  locale: 'zh_CN',
  events: 'blur',
  strict: true
}
Vue.use(Validate, config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
