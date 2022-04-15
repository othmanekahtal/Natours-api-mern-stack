const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have a review'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // to ignore the selection the created at in select
      select: false,
    },
    tour: {
      type: Schema.ObjectId,
      ref: 'tour',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'user',
      required: [true, 'A review must belong to a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'username imageCover',
  });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
