const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../Controllers/User');

const express = require('express');
const Users = express.Router();

Users
  .route('/')
  .get(getAllUsers)
  .post(createUser);

Users
  .route(':id/')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = Users;
