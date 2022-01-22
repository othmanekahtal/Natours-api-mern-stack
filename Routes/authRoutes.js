const { signup, login, forgotPassword, resetPassword } = require('./../Controllers/authController');
const express = require('express');
const router = express.Router();
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forget-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
module.exports = router;