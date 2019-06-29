var express = require('express');
var crypto = require("crypto");   // 加密组件
var router = express.Router();
var xmQuery = require('./xm_query');

// 创建管理员账号
router.get('/master', (req, res, next) => {
  xmQuery('select * from users where username="xm_master"', res, function (result) {
    if (result.length <= 0) {
      var password = crypto.createHmac('md5', 'xm_blog').update('qjl252363??').digest('hex'); // xm_blog 为 secret
      var keys = ['level', 'username', 'password', 'sex', 'mobile', 'email', 'avatar', 'birthday'];
      var values = [1, '"xm_master"', `"${password}"`, 1, '"13107705855"', '"qjl_0805@126.com"', '"admin_avatar.png"', '"1990-09-23"'];
      xmQuery(`insert into users (${keys.join(',')}) values (${values.join(',')})`, res);
    }
  });
});

// 通过用户id获取当前用户信息
router.get('/userid/:id', (req, res, next) => {
  var sql = `select * from users where userid='${req.params.id}'`;
  xmQuery(sql, res);
});
// 通过用户名获取用户信息
router.get('/username/:name', (req, res, next) => {
  var sql = `select * from users where username='${req.params.name}'`;
  xmQuery(sql, res);
});

module.exports = router;