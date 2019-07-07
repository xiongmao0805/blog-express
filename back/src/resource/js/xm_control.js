var vue;
import axios from 'axios';
import layer from 'vue-layer';
import Validate, { Validator } from 'vee-validate';
import { getCookie } from './utils';
import zh_CN from 'vee-validate/dist/locale/zh_CN';

export function xm_layer(Vue, options) {
  Vue.prototype.$xm_layer = layer(Vue, {
    msgtime: 1,
  });
  if (options.status == 'danger') {
    Vue.prototype.$xm_layer.confirm(options.content, {
      title: options.title ? options.title : '提示',
      shade: options.shade ? options.shade : false,
      shadeClose: false,
    }, function () {
      // 强制关闭所有弹层
      if (options.closeAll === true) {
        Vue.prototype.$xm_layer.closeAll();
        return;
      }
      // 点击确认后可执行回调
      if (options.callback && typeof options.callback === 'function') {
        options.callback();
      }
      Vue.prototype.$xm_layer.close(this.id);
    });
  } else {
    Vue.prototype.$xm_layer.msg(options.content, function () {
      // 强制关闭所有弹层
      if (options.closeAll === true) {
        Vue.prototype.$xm_layer.closeAll();
        return;
      }
      if (options.callback && typeof options.callback === 'function') {
        options.callback();
      }
      Vue.prototype.$xm_layer.close(this.id);
    });
  }
}

export function xm_ajax(Vue, options) {
  vue = Vue;
  return ajax(options);
}

// 创建ajax实例
const ajax = axios.create({
  baseURL: window.location.origin + '/api',
  timeout: 5000,
});

// 统一处理请求
ajax.interceptors.request.use(function (req) {
  // console.log(req);
  // limit为false的请求，不做处理
  if (req.limit === false) return req;

  var userid = getCookie('userid'),
    username = getCookie('username'),
    token = getCookie('token');
  req.headers.userid = userid;
  req.headers.username = username;
  req.headers.token = token;
  return req
}, function (err) {
  var msg = "请求失败：" + err.message;
  vue.prototype.$layer({
    content: "请求失败：" + res.data.msg,
    status: 'danger'
  });
  Promise.reject(err);
});
// 统一处理返回
ajax.interceptors.response.use(function (res) {
  // console.log(res);
  if (res.status !== 200) {
    console.log(1)
    vue.prototype.$layer({
      content: "请求失败：" + res.data.msg,
      status: 'warning'
    });
  }
  return res;
}, function (err) {
  var msg = "请求失败：" + err.message;
  vue.prototype.$layer({
    content: "请求失败：" + res.data.msg,
    status: 'danger'
  });
  return Promise.reject(err);
});

// 表单验证
export function xm_validate(Vue) {
  // 自定义验证规则
  Validator.extend('phone', {
    getMessage: (field, params, data) => data.message,
    validate: value => /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(value)
  });
  // 自定义错误提示
  const dictionary = {
    zh_CN: {
      messages: {
        required: (field) => field + '不可为空',
        min: (field, leng) => field + '不得少于' + leng + '位字符',
        max: (field, leng) => field + '不得多于' + leng + '位字符',
        regex: function (field) {
          switch (field) {
            default:
              return field + '不合法';
          }
        },
        phone: () => '无效的手机号码',
        email: () => '邮箱格式不正确',
        url: () => '无效的链接地址'
      },
      attributes: {
        username: '用户名',
        password: '密码',
        email: '邮箱',
        phone: '手机号',
      }
    }
  };
  Validator.localize(dictionary);

  const config = {
    locale: 'zh_CN',
    events: 'blur',
    strict: true
  }
  Vue.use(Validate, config);
}