const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../Controllers/reviewController');
const express = require('express');
// when we set the mergeParams: true, we can access the tourId from the params
const router = express.Router({ mergeParams: true });
const { protect, onlyFor } = require('../Controllers/authController');
router
  .route('/')
  .get(getReviews)
  .post(onlyFor('user'), setTourUserIds, createReview);
router
  .route('/:id')
  .get(protect, getReview)
  .delete(protect, onlyFor('admin'), deleteReview)
  .patch(protect, onlyFor('admin'), updateReview);

exports.reviewRouter = router;
