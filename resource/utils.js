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

let tokenCheck = function (req, res) {
  let token = req.headers.token;
  if (!token) {
    res.status(304).json({
      msg: 'token expired'
    });
    return;
  }

  let timestamp = decrypt(token).split('=')[3] / 1000,
    timestamp1 = Date.parse(new Date()) / 1000;

  if (timestamp1 - timestamp > 30 * 60 ) {
    res.status(304).json({
      msg: 'token expired'
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
  tokenCheck,
  formatParams,
}