var express = require('express');
var crypto = require("crypto");   // 加密组件
var xmQuery = require('./xm_query');
var router = express.Router();
var { check, validationResult } = require('express-validator/check');

// 参数验证
var logRegCheck = [
  check("username").isLength({ min: 2, max: 30 }).withMessage('length must be 2-30 characters'),
  check("username").matches(/\w/g).withMessage('Invalid value'),
  check("password").isLength({ min: 6, max: 30 }).withMessage('length must be 6-30 characters'),
];
router.post('/', logRegCheck, (req, res, next) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err = errors.array()[0];
    return res.status(300).json({
      msg: err.param + ' ' + err.msg
    });
  }
  // 密码加密
  req.body.password = crypto.createHmac('md5', 'xm_blog').update(req.body.password).digest('hex');
  var sql = `select * from users where username='${req.body.username}' and password='${req.body.password}'`;
  xmQuery(sql, res, data => {
    debugger
    if (data.length <= 0) {
      return res.status(300).json({
        msg: '用户名或密码不正确',
      });
    } else {
      var userinfo = data[0];
      var token = userinfo.userid + userinfo.username;
      token = crypto.createHmac('md5', 'xm_blog').update(token) + ';' + new Date(Date.parse(new Date()));
      token = crypto.createHmac('md5', 'xm_blog').update(token).digest('hex');
      userinfo.token = token;
      userinfo.birthday = userinfo.birthday.toLocaleDateString();
      return res.json(userinfo);
    }
  });
});

module.exports = router;