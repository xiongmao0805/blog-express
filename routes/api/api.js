var express = require('express');
var mysql = require('mysql');
var utility = require('utility');
var { check, validationResult } = require('express-validator/check');
var sqlString = require('./sqlString');
var router = express.Router();

var connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qjl252363',
  database: 'blog'
});

/* 自动创建管理员账号 */
connect.query('select * from users where username="熊猫"', (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  if (result.length <= 0) {
    var password = utility.sha1(utility.md5('xm_0805??'));
    var keys = ['level', 'username', 'password', 'sex', 'mobile', 'email', 'avatar', 'birthday'];
    var values = [1, '"熊猫"', `"${password}"`, 1, '"13107705855"', '"qjl_0805@126.com"', '"admin_avatar.png"', '"1990-09-23"'];
    connect.query(`insert into users (${keys.join(',')}) values (${values.join(',')})`, (err, result) => {
      if (err) console.log(err);
    });
  }
});
/* 自动创建管理员账号 */

function sqlQuery(sql, res, fn) {
  connect.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(result)
    if (typeof fn == 'function') {
      fn(result);
      return;
    }

    if (!Array.isArray(result)) {
      res.json({
        count: result.affectedRows,
        msg: '成功',
      });
      return;
    }
    res.json(result);
  });
}

/* middle ware */
router.get('/', (req, res, next) => {
  next();
});
router.post('/', (req, res, next) => {
  next();
});

/* 登录注册 */
router.post('/login', (req, res, next) => {
  var sql = sqlString.login;
});
router.post('/register', [
  check('username').isLength({ min: 2, max: 30 }),
  check('password').isLength({ min: 6, max: 30 }),
], (req, res, next) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err = errors.array()[0];
    return res.status(300).json({
      msg: err.param + ' ' + err.msg
    });
  }
  if (!/^[\w一-龥]+$/g.test(req.body.username)) {
    return res.status(300).json({
      msg: 'username Invalid value'
    });
  }

  var testStr = sqlString.get.getUserByName(req.body.username);
  sqlQuery(testStr, res, data => {
    if (data.length > 0) {
      return res.status(300).json({
        msg: '用户名已被注册',
      });
    }
    req.body.password = utility.sha1(utility.md5(req.body.password));
    var sqlStr = sqlString.post.register(req.body);
    sqlQuery(sqlStr, res);
  });
});
/* 登录注册 */

/* 获取用户 */
router.get('/getUserByName/:name', (req, res, next) => {
  var sqlStr = sqlString.get.getUserByName(req.params.name);
  sqlQuery(sqlStr, res);
});
router.get('/getAllUser', (req, res, next) => {
  var sqlStr = sqlString.get.getUser;
  sqlQuery(sqlStr, res);
});
/* 获取用户 */

module.exports = router;