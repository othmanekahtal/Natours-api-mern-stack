const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  deleteMe,
} = require('../Controllers/userController');
const { protect, onlyFor } = require('./../Controllers/authController');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser)
  .patch(protect, updateUser)
  .delete(protect, deleteMe)
  .delete(protect, onlyFor('admin'), deleteUser);

router.route('/:id/').get(getUser);

module.exports = router;
