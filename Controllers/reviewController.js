const AsyncCatch = require('../utils/asyncCatch');
const reviewModel = require('../models/reviewsModel');

exports.getReviews = AsyncCatch(async (req, res) => {
  const filter = {};
  if (req.params.tourId) filter.tour = req.params.tourId;
  const reviews = await reviewModel.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = AsyncCatch(async (req, res) => {
  req.body.tour ??= req.params.tourId;
  req.body.user ??= req.user.id;
  const review = await reviewModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
