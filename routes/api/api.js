var express = require('express');
var router = express.Router();

var login = require('./login');
var register = require('./register');
var user = require('./user');

router.use('/login', login);
router.use('/register', register);
router.use('/user', user);

module.exports = router;