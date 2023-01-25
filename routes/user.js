const express = require('express');
const router = express.Router(); // permet la création d'un router

const userCtrl = require('../controllers/user');
const validator = require('../middleware/email');
const password = require('../middleware/password');

router.post('/signup', validator, password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;