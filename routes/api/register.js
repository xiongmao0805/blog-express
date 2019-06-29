var express = require('express');
var crypto = require("crypto");   // 加密组件
var xmQuery = require('./xm_query');
var router = express.Router();
var { check, validationResult } = require('express-validator/check');
var { formatParams } = require('./utils');

// 参数验证
var logRegCheck = [
  check("username").isLength({ min: 2, max: 30 }).withMessage('length must be 2-30 characters'),
  check("username").matches(/\w/g).withMessage('Invalid value'),
  check("password").isLength({ min: 6, max: 30 }).withMessage('length must be 6-30 characters'),
];
router.post('/register', logRegCheck, (req, res, next) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err = errors.array()[0];
    return res.status(300).json({
      msg: err.param + ' ' + err.msg
    });
  }

  var sql = `select * from users where username='${req.body.username}'`;
  xmQuery(sql, res, data => {
    if (data.length > 0) {
      return res.status(300).json({
        msg: '用户名已被注册',
      });
    }
    // 密码加密
    req.body.password = crypto.createHmac('md5', 'xm_blog').update('xm_0805??').digest('hex');
    var params = formatParams(req.body);
    var keys = params.keys, vals = params.vals;
    var sql2 = `insert into users (${keys.join(',')}) values (${vals.join(',')})`;
    xmQuery(sql2, res);
  });
});

module.exports = router;