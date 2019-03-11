var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qjl252363',
  database: 'blog'
});
var mysqlQuery = require('./mysqlQuery');

function mysqlOperate(sql, res) {
  connect.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      var json = {
        code: 300,
        message: '错误'
      }
      return res.json(json);
    }
    var json = {
      code: 200,
      message: '成功',
      data: result
    }
    res.json(json);
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
  var sql = mysqlQuery.login;
});
router.post('/register', (req, res, next) => {
  var sqlStr = mysqlQuery.post.register(req.body);
  mysqlOperate(sqlStr, res);
});
/* 登录注册 */

/* 获取用户 */
router.get('/getUserByName/:name', (req, res, next) => {
  var sqlStr = mysqlQuery.get.getUserByName(req.params.name);
  mysqlOperate(sqlStr, res);
});
router.get('/getAllUser', (req, res, next) => {
  var sqlStr = mysqlQuery.get.getUser;
  mysqlOperate(sqlStr, res);
});
/* 获取用户 */

module.exports = router;