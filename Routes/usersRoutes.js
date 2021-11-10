const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../Controllers/userController');

const express = require('express');
const router = express.Router();
// router.param('id', (request, response, next, value) => {
//   console.log(`id is :${value}`);
// });
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id/')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
