const userModel = require('../models/userModel');
const asyncCatch = require('../utils/asyncCatch');
const ErrorHandler = require('../utils/errorHandler');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = asyncCatch(async (req, res, next) => {
  const users = await userModel.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (request, response) => {
  // console.log(request.body);
  response.status(500).json({
    message: 'failed',
    result: '<route not define yeat>',
    /**
     * This is optional only in array with multiple elements (objects)
     */
  });
};

exports.getUser = (request, response) => {
  // implementation :
  /**
   * if id is in the array we return it if not we send nit found code page
   */
  response.status(500).json({
    message: 'failed',
    result: '<route not define yeat>',
    /**
     * This is optional only in array with multiple elements (objects)
     */
  });
};

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

exports.deleteUser = asyncCatch(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
