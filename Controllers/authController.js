const AsyncCatch = require('../utils/asyncCatch');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('./../utils/errorHandler');
const { promisify } = require('util');
const mail = require('./../utils/mail');
const generateToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
exports.login = AsyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new ErrorHandler({
        message: 'provide email and password !',
        statusCode: 400,
      })
    );
  let response = await userModel.findOne({ email })?.select('+password');
  console.log(response);
  const passwordsMatch = await response?.correctPassword({
    candidatePassword: response.password,
    userPassword: password,
  });
  if (response && passwordsMatch)
    return res.status(201).json({
      status: 'success',
      token: await generateToken(response._id),
    });
  next(
    new ErrorHandler({
      message: 'password or email is not correct',
      statusCode: 401,
    })
  );
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
    data: response,
  });
});

exports.protect = AsyncCatch(async (req, res, next) => {
  /// we need to verify tree layer : token,verification token,check if user is exists ,check if user change password after the token was issued
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ').at(-1);
  }
  if (!token) {
    next(
      new ErrorHandler({ message: "You're not authorized !", statusCode: 401 })
    );
  }
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const userFresh = await userModel.findById(decodedToken.id);
  if (!userFresh)
    next(
      new ErrorHandler({
        message: 'The user belonging to this token does no longer exist.',
        statusCode: 401,
      })
    );
  if (!userFresh.changedAfter({ date: decodedToken.iat })) {
    next(
      new ErrorHandler({
        message: 'You changed password , you need to login again!',
        statusCode: 401,
      })
    );
  }
  req.user = userFresh;
  next();
});
exports.onlyFor =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler({
          message: 'You do not have permission to perform this action',
          statusCode: 403,
        })
      );
    }
    next();
  };
exports.forgotPassword = AsyncCatch(async (req, res, next) => {
  // 1- get user based on POSTed email
  const email = req.body.email;
  const user = await userModel.findOne({ email });
  if (!user)
    return next(
      new ErrorHandler({
        message: 'There is no user with email address',
        statusCode: 404,
      })
    );
  // 2-generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await mail({
      email,
      subject: 'activate your account',
      message,
    });
    res.status(200).json({ status: 'success', message: 'check your email' });
  } catch (error) {
    user.resetTokenExpiration = user.resetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler({
        message: 'email not send try later!',
        statusCode: 500,
      })
    );
  }
});
exports.resetPassword = AsyncCatch(async (req, res, next) => {
  console.log(req);
});
