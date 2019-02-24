var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qjl252363',
    database: 'blog'
});
var sqlQuery = require('./sqlQuery');

function getQueryList(sql, res) {
    connect.query(sql, (err, result) => {
        if (err) {
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

/* GET api interface */
router.get('/', (req, res, next) => {
    // res.send('respond with a resource');
    next();
});

router.get('/getUser', (req, res, next) => {
    var sql = sqlQuery.getUser;
    getQueryList(sql, res);
});
/* GET api interface */

module.exports = router;
