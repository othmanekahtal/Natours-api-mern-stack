const { signup, login, forgotPassword, resetPassword } = require('./../Controllers/authController');
const express = require('express');
const router = express.Router();
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forget-password').post(forgotPassword);
// we use patch because we need to change some fields
router.route('/reset-password/:token').patch(resetPassword);
module.exports = router;