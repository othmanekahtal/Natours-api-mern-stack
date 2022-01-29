const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../Controllers/userController');
const { protect } = require('./../Controllers/authController');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

router.route('/:id/').get(getUser);

module.exports = router;
