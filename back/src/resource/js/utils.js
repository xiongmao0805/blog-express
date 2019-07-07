// cookie
export function setCookie(key, value, time) {
  if (!time) time = 60 * 60 * 1000;
  let timestamp = Date.parse(new Date());
  let date = new Date(timestamp + time);
  document.cookie = key + "=" + escape(value) + ";path=/;expires=" + date.toGMTString();
}
export function getCookie(key) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(key + "=");
    if (start != -1) {
      start = start + key.length + 1;
      let end = document.cookie.indexOf(";", start);
      if (end == -1) end = document.cookie.length;
      return unescape(document.cookie.substring(start, end));
    }
  }
  return "";
}

// 格式化日期
export function formatDate(timestamp, flag) {
  let date = timestamp ? new Date(timestamp * 1000) : new Date();
  let year = date.getFullYear(), month = date.getMonth(), days = date.getDay();
  month = month < 10 ? '0' + month : month;
  days = days < 10 ? '0' + days : days;
  let d = year + '-' + month + '-' + days;
  if (flag === false) return d;

  let t = date.toLocaleTimeString(), section = t.substr(0, 2);
  t = t.substr(2);
  let arr = t.split(':');
  let h = arr[0], m = arr[1], s = arr[2];
  if (section == '上午') {
    if (h.length < 2) h = '0' + h;
  } else if (section == '下午') {
    h = String(parseInt(h) + 12);
  }
  t = timestamp ? h + ':' + m : h + ':' + m + ':' + s;

  return d + ' ' + t;
}
export function formatHtml(str) {
  let ptn = /<[^<>]+>/g;
  let text = str.replace(ptn, '');
  return text.replace(/&nbsp;/g, ' ');
}
export function toBase64(vue, img, field) {   //图片转为base64
  let reader = new FileReader();
  reader.readAsDataURL(img);
  let timer = setInterval(() => {
    if (reader.readyState == 2) {
      clearInterval(timer);
      vue[field] = reader.result;
    }
  }, 300);
}
export function isModified(vue, arr, field) {    //表单验证是否经过修改
  let i = 0;
  for (let param in vue[field]) {
    if (arr.indexOf(param) >= 0) continue;
    if (vue[field][param] != vue[param]) {
      vue.changeData[param] = vue[param];
      i++;
    }
  }
  if (i <= 0) {
    vue.changed = false;
    vue.changeData = {};
    return false;
  }
  vue.changed = true;
  return true;
}

export function addList(vue, url, params) {  //添加
  vue.$ajax({
    method: 'post',
    url: url,
    headers: {
      token: getCookie('token')
    },
    data: params
  }).then((res) => {
    if (res.data.resultCode == 200) {
      vue.$layer.msg(res.data.resultMsg, () => {
        vue.$layer.closeAll();
        vue.flag = false;
        vue.$emit('update');
        window.history.back();
      });
    } else {
      let msg = (typeof res.data.resultMsg == 'object') ? res.data.resultMsg[0] : res.data.resultMsg;
      vue.$layer.msg(msg, () => {
        vue.$layer.closeAll();
        vue.flag = false;
      });
    }
  }).catch((err) => {
    vue.$layer.msg('数据访问失败', () => {
      vue.$layer.closeAll();
      vue.flag = false;
    });
  });

}
export function modifyList(vue, url, params) {  //修改
  vue.$ajax({
    method: 'put',
    url: url,
    headers: {
      token: getCookie('token')
    },
    data: params
  }).then((res) => {
    if (res.data.resultCode == 200) {
      vue.$layer.msg(res.data.resultMsg, () => {
        vue.$layer.closeAll();
        window.location.reload();
      });
    } else {
      let msg = (typeof res.data.resultMsg == 'object') ? res.data.resultMsg[0] : res.data.resultMsg;
      vue.$layer.msg(msg, () => {
        vue.$layer.closeAll();
        vue.flag = false;
      });
    }
  }).catch((err) => {
    vue.$layer.msg('数据访问失败', () => {
      vue.$layer.closeAll();
      vue.flag = false;
    });
  });
}
export function deleteList(vue, url, str) {  //删除
  if (vue.deleteFlag) return;
  vue.deleteFlag = true;
  vue.$layer.confirm('确定要删除这个' + str + '吗?', {
    type: 0,
    title: '提示'
  }, () => {
    vue.$layer.closeAll();

    vue.$ajax({
      method: 'delete',
      url: url,
      headers: {
        token: getCookie('token')
      }
    }).then((res) => {
      if (res.data.resultCode == 200) {
        vue.getList();
      }
      vue.$layer.msg(res.data.resultMsg, () => {
        vue.$layer.closeAll();
        vue.deleteFlag = false;
      });
    }).catch((err) => {
      vue.$layer.msg('删除失败', () => {
        vue.$layer.closeAll();
        vue.deleteFlag = false;
      });
    });
  }, () => {
    vue.deleteFlag = false;
    vue.$layer.closeAll();
  });
}