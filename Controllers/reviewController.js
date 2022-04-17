const reviewModel = require('../models/reviewsModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handleFactory');
exports.setTourUserIds = (req, res, next) => {
  req.body.tour ??= req.params.tourId;
  req.body.user ??= req.user.id;
  next();
};
exports.getReviews = getAll({ model: reviewModel });
exports.createReview = createOne({ model: reviewModel });
exports.deleteReview = deleteOne({ model: reviewModel });
exports.updateReview = updateOne({ model: reviewModel });
exports.getReview = getOne({ model: reviewModel });
