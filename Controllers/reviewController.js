const AsyncCatch = require('../utils/asyncCatch');
const reviewModel = require('../models/reviewsModel');

exports.getReviews = AsyncCatch(async (req, res) => {
  const reviews = await reviewModel.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = AsyncCatch(async (req, res) => {
  const review = await reviewModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
