var mysql = require('mysql');
var connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qjl252363',
  database: 'blog'
});

// 查询sql
function xmQuery(sql, res, fn) {
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

module.exports = xmQuery;