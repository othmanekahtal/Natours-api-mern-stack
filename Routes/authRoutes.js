const { signup, login } = require('./../Controllers/authController');
const express = require('express');
const router = express.Router();
router.route('/signup').post(signup);
router.route('/login').post(login);
module.exports = router;