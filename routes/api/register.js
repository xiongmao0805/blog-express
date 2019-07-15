let express = require('express');
let router = express.Router();
let crypto = require("crypto-js");   // 加密组件
let { myquery, formatParams } = require('../../resource/utils');
let { check, validationResult } = require('express-validator/check');

// 参数验证
let logRegCheck = [
  check("username").isLength({ min: 2, max: 30 }).withMessage('length must be 2-30 characters'),
  check("username").matches(/\w/g).withMessage('Invalid value'),
  check("password").isLength({ min: 6, max: 30 }).withMessage('length must be 6-30 characters'),
];
router.post('/', logRegCheck, (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = errors.array()[0];
    return res.status(300).json({
      msg: err.param + ' ' + err.msg
    });
  }

  let sql = `select * from users where username='${req.body.username}'`;
  myquery(sql, res, data => {
    if (data.length > 0) {
      return res.status(300).json({
        msg: '用户名已被注册',
      });
    }
    // 密码加密
    req.body.password = crypto.MD5(req.body.password);
    let params = formatParams(req.body);
    let keys = params.keys, vals = params.vals;
    let sql2 = `insert into users (${keys.join(',')}) values (${vals.join(',')})`;
    myquery(sql2, res);
  });
});

module.exports = router;