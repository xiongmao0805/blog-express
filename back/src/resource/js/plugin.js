import Vue from 'vue';
import axios from 'axios';
import layer from 'vue-layer';
import Validate, { Validator } from 'vee-validate';
import { getCookie } from './utils';
import zh_CN from 'vee-validate/dist/locale/zh_CN';

// 注册弹窗组件
Vue.prototype._layer = layer(Vue, {
  msgtime: 1,
});
// 注册并统一弹窗组件
const mylayer = function (options) {
  if (options.status == 'danger') {
    Vue.prototype._layer.confirm(options.content, {
      title: options.title ? options.title : '提示',
      shade: options.shade ? options.shade : false,
      shadeClose: false,
    }, function () {
      // 强制关闭所有弹层
      if (options.closeAll === true) {
        Vue.prototype._layer.closeAll();
        return;
      }
      // 点击确认后可执行回调
      if (options.callback && typeof options.callback === 'function') {
        options.callback();
      }
      Vue.prototype._layer.close(this.id);
    });
  } else {
    Vue.prototype._layer.msg(options.content, function () {
      // 强制关闭所有弹层
      if (options.closeAll === true) {
        Vue.prototype._layer.closeAll();
        return;
      }
      if (options.callback && typeof options.callback === 'function') {
        options.callback();
      }
      Vue.prototype._layer.close(this.id);
    });
  }
}

// 创建ajax实例
const myaxios = axios.create({
  baseURL: window.location.origin + '/api',
  timeout: 5000,
});
// 统一处理请求
myaxios.interceptors.request.use(function (req) {
  // console.log(req);
  // limit为false的请求，不做处理
  if (req.limit === false) return req;

  let userid = getCookie('userid'),
    username = getCookie('username'),
    token = getCookie('token');
  req.headers.userid = userid;
  req.headers.username = username;
  req.headers.token = token;
  return req
}, function (err) {
  debugger
  mylayer({
    content: "请求超时！",
  });
  Promise.reject(err);
});
// 统一处理返回
myaxios.interceptors.response.use(function (res) {
  if (res.status !== 200) {
    mylayer({
      content: "请求失败：" + res.data.msg,
      status: 'warning'
    });
  }
  return res;
}, function (err) {
  let res = err.response,
    status = res.status;
  if (status == 504 || status == 404) {
    mylayer({
      content: "请求失败：" + res.data,
      status: 'danger'
    });
  } else if (status == 403) {
    mylayer({
      content: "权限不足，请联系管理员！",
    });
  } else {
    mylayer({
      content: "未知错误！",
    });
  }
  return Promise.reject(err);
});

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

export {
  myaxios,
  mylayer,
  Validate
};