const AsyncCatch = require('../utils/asyncCatch');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('./../utils/errorHandler');
const generateToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};
exports.login = AsyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  console.log();
  if (!email || !password) return next(new ErrorHandler({ message: 'provide email and password !', statusCode: 400 }));
  let response = await userModel.findOne({ email }).select('+password');

  const passwordsMatch = await response.correctPassword({
    candidatePassword: response.password,
    userPassword: password
  });
  if (response && passwordsMatch)
    return res.status(201).json({
      status: 'success',
      token: await generateToken(response._id)
    });
  next(new ErrorHandler({ message: 'password or email is not correct', statusCode: 401 }));
});

exports.signup = AsyncCatch(async (req, res) => {
  const user = req.body;
  user.role = undefined;
  let response = await userModel.create(user);
  response.password = undefined;
  const token = await generateToken(response._id);
  res.status(201).json({
    status: 'success',
    token,
    data: response
  });
});