let express = require('express');
let router = express.Router();
let { myquery, checkSign, checkToken } = require('../../resource/utils');

router.use('/*', (req, res, next) => {
  let isSignValid = checkSign(req, res);
  let isTokenValid = checkToken(req, res);
  if (!isSignValid || !isTokenValid) {
    return;
  }
  next();
});

router.get('/list', (req, res, next) => {
  let sql = `select * from category`;
  myquery(sql, res);
});


module.exports = router;