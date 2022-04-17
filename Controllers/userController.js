const userModel = require('../models/userModel');
const asyncCatch = require('../utils/asyncCatch');
const ErrorHandler = require('../utils/errorHandler');
const { deleteOne, getOne, getAll, updateOne } = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createUser = (request, response) => {
  response.status(500).json({
    message: 'failed',
    result: '<route not define yeat>',
    /**
     * This is optional only in array with multiple elements (objects)
     */
  });
};

exports.updateMe = asyncCatch(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorHandler({
        message:
          'This route is not for password updates. Please use /update-password.',
        statusCode: 400,
      })
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = asyncCatch(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUser = updateOne({ model: userModel });
exports.deleteUser = deleteOne({ model: userModel });
exports.getUser = getOne({ model: userModel });
exports.getAllUsers = getAll({ model: userModel });
exports.getUser = getOne({ model: userModel });
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
