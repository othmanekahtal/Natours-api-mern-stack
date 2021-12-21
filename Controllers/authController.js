const AsyncCatch = require('../utils/asyncCatch');
const userModel = require('../models/userModel');

exports.login = AsyncCatch(async (req, res) => {
  res.status(200).json({ ...req.body });
});

exports.signup = AsyncCatch(async (req, res) => {
  const user = req.body;
  let response = await userModel.create(user);
  res.status(201).json({
    status: 'success',
    data: response
  });
});