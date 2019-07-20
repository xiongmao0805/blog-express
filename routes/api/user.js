let express = require('express');
let router = express.Router();
let crypto = require("crypto-js");   // 加密组件
let { myquery, checkSign, checkToken, encrypt } = require('../../resource/utils');

// 创建管理员账号
router.get('/master', (req, res, next) => {
  myquery('select * from users where username="xm_master"', res, function (result) {
    if (result.length <= 0) {
      let password = crypto.MD5('qjl252363??');
      let keys = ['level', 'username', 'password', 'sex', 'mobile', 'email', 'avatar', 'birthday'];
      let values = [1, '"xm_master"', `"${password}"`, 1, '"13107705855"', '"qjl_0805@126.com"', '"admin_avatar.png"', '"1990-09-23"'];
      myquery(`insert into users (${keys.join(',')}) values (${values.join(',')})`, res);
    }
  });
});

// 通过用户id获取当前用户信息
router.get('/userid/:id', (req, res, next) => {
  let sql = `select * from users where userid='${req.params.id}'`;
  myquery(sql, res);
});
// 通过用户名获取用户信息
router.get('/username/:name', (req, res, next) => {
  let sql = `select * from users where username='${req.params.name}'`;
  myquery(sql, res);
});

router.use('/token/', (req, res, next) => {
  let isSignValid = checkSign(req, res);
  let isTokenValid = checkToken(req, res);
  if (!isSignValid || !isTokenValid) {
    return;
  }
  next();
});
router.get('/token/freshToken', (req, res, next) => {
  let heders = req.headers;
  if (!heders.userid || !heders.username) {
    res.status(300).json({
      msg: 'token 刷新失败！'
    });
    return;
  }
  let token = `userid=${heders.userid};username=${heders.username};timestamp=${Date.parse(new Date())}`;
  token = encrypt(token);
  res.json({
    token: token
  });
});

module.exports = router;