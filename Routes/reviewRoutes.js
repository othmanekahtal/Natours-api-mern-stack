const { getReviews, createReview } = require('../Controllers/reviewController');
const express = require('express');
const router = express.Router();
const { protect, onlyFor } = require('../Controllers/authController');
router.route('/').get(getReviews).post(protect, onlyFor('user'), createReview);

exports.reviewRouter = router;
