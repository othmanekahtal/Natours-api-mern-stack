const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  deleteMe,
  updateMe,
  getMe,
} = require('../Controllers/userController');

const { protect, onlyFor } = require('./../Controllers/authController');
const express = require('express');
const router = express.Router();

router.use(protect);

router.get('/me', protect, getMe, getUser);
router.patch('/me/update', protect, updateMe);
router.delete('/me/delete', protect, deleteMe);
router.use(onlyFor('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id/').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
