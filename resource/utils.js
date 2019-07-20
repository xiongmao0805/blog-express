let mysql = require('mysql');
let crypto = require("crypto-js");   // 加密组件
let connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qjl252363',
  database: 'blog'
});

// 查询sql
let myquery = function (sql, res, fn) {
  connect.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (typeof fn == 'function') {
      fn(result);
      return;
    }

    if (!Array.isArray(result)) {   // 接口返回值为非数组数据
      res.json({
        count: result.affectedRows,
        msg: '成功',
      });
      return;
    }
    res.json(result);
  });
}

// 将字符串转为16进制
let uniCode16 = function (str) {
  if (typeof str !== 'string') return '';
  let res = '';
  for (let i = 0; i < str.length; i++) {
    res += str.charCodeAt(i).toString(16);
  }
  return res;
}
// 加密解密所使用的key，必须为字符串转为16进制字符，并且转后长度为16位
let key = uniCode16('blog_key');
// 加密解密所使用的iv，必须为字符串转为16进制字符，并且转后长度为16位
let iv = uniCode16('qjl_blog');
let cryptoConfig = {
  iv: iv,
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7
}
// 加密
let encrypt = function (str) {
  if (typeof str === 'string') {
    let chiper = crypto.AES.encrypt(str, key, cryptoConfig);
    let res = chiper.toString();
    return res;
  }
  return false;
}
// 解密
let decrypt = function (str) {
  if (typeof str === 'string') {
    let chiper = crypto.AES.decrypt(str, key, cryptoConfig);
    let res = chiper.toString(crypto.enc.Utf8);
    return res;
  }
  return false;
}

let checkToken = function (req, res) {
  let token = req.headers.token;
  if (!token) {
    res.status(304).json({
      msg: 'token expired'
    });
    return;
  }

  let timestamp = decrypt(token).split('=')[3] / 1000,
    timestamp1 = Date.parse(new Date()) / 1000;

  if (timestamp1 - timestamp > 30 * 60) {
    res.status(304).json({
      msg: 'token expired'
    });
  }
}

let asciiSort = function (a, b, key, flag) {
  if (typeof a === 'object') a = a[key], b = b[key];
  if (typeof a === 'string') flag = key;

  if (a < b) {
    if (flag === false) return 1;
    return -1;
  }
  if (a > b) {
    if (flag === false) return -1;
    return 1;
  }
  return 0;
}

let getSign = function (params) {
  let sign_params = [], secret = "xm_blog";

  for (let key in params) {
    if (key === 'sign' || key === 'token') {
      continue;
    }
    let val = params[key];
    if (typeof val === "undefined" || val === null || val === '') {
      continue;
    }
    if (/\W/g.test(key)) {
      console.warn('接口请求参数名key请不要使用特殊字符，但可使用字母数字_');
      continue;
    }
    let p = { key: key };
    if (typeof val === 'object') {
      p.val = JSON.stringify(val);
    } else {
      p.val = String(val);
    }
    sign_params.push(p);
  }

  let str = '';
  let arr = sign_params.sort(function (a, b) {
    return asciiSort(a, b, 'key');
  });
  arr.forEach(a => {
    str += a.key + a.val;
  });
  let sign = crypto.MD5(secret + str + secret).toString().toUpperCase();
  return sign;
}

let checkSign = function (req, res) {
  if (req.method == 'GET') {
    var params = req.query;
  } else if (req.method == 'POST') {
    var params = req.body;
  }
  let sign = getSign(params);

  if (sign !== params.sign) {
    res.status(402).json({
      msg: '签名不正确！'
    });
  }
}

let formatParams = function (params) {
  let keys = [], values = [];
  for (key in params) {
    if (params[key]) {
      keys.push(key);
      values.push(`"${params[key]}"`);
    }
  }
  return { keys: keys, vals: values };
}

module.exports = {
  myquery,
  encrypt,
  decrypt,
  checkToken,
  checkSign,
  formatParams,
}