let express = require('express');
let router = express.Router();

let login = require('./login');
let register = require('./register');
let user = require('./user');

router.use('/login', login);
router.use('/register', register);
router.use('/user', user);

router.get('/favicon.ico',  (req, res, next) => {
  res.end();
});

module.exports = router;