let express = require('express');
let router = express.Router();

let login = require('./login');
let register = require('./register');
let user = require('./user');
let category = require('./category');

router.use('/login', login);
router.use('/register', register);
router.use('/user', user);
router.use('/category', category);

router.get('/favicon.ico',  (req, res, next) => {
  res.end();
});

module.exports = router;