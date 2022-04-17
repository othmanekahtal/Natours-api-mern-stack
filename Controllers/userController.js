const userModel = require('../models/userModel');
const asyncCatch = require('../utils/asyncCatch');
const ErrorHandler = require('../utils/errorHandler');
const { deleteOne, getOne, getAll } = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = getAll({ model: userModel });

exports.createUser = (request, response) => {
  response.status(500).json({
    message: 'failed',
    result: '<route not define yeat>',
    /**
     * This is optional only in array with multiple elements (objects)
     */
  });
};

exports.getUser = getOne({ model: userModel });

exports.updateUser = asyncCatch(async (req, res, next) => {
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

exports.deleteUser = deleteOne({ model: userModel });

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
