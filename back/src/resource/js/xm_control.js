var vue;
import axios from 'axios';
import layer from 'vue-layer';
import { getCookie } from './utils';

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
var ajax = axios.create({
  baseURL: window.location.origin + '/api',
  timeout: 5000,
});

// 统一处理请求
ajax.interceptors.request.use(function (req) {
  // console.log(req);
  // limit为false的请求，不做处理
  if (req.limit === false) {
    return req;
  }
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