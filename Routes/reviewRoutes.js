const { getReviews, createReview } = require('../Controllers/reviewController');
const express = require('express');
// when we set the mergeParams: true, we can access the tourId from the params
const router = express.Router({ mergeParams: true });
const { protect, onlyFor } = require('../Controllers/authController');
router.route('/').get(getReviews).post(onlyFor('user'), createReview);

exports.reviewRouter = router;
