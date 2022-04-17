const tourModel = require('../models/tourModel');
const asyncCatch = require('../utils/asyncCatch');
const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
  createOne,
} = require('./handleFactory');
// we need to exclude some fields in query like a page and limit and ...

/*
 * to implement operators in queries we do (example:duration>=12 - duration[gte]=12)
 * sorting in mongoose is very simple : asc + and desc -
 * TO LIMIT FIELDS AND EXCLUDED IT YOU NEED TO ADD - IN SELECT
 * TO HIDE FIELDS YOU NEED TO ADD SELECT:FALSE IN MODEL
 * always add await when you interact with mongodb
 */
exports.getAllTours = getAll({ model: tourModel });
exports.createTour = createOne({ model: tourModel });
exports.getTour = getOne({ model: tourModel });
exports.updateTour = updateOne({ model: tourModel });
exports.deleteTour = deleteOne({ model: tourModel });
exports.getTopAlias = async (req, res, next) => {
  req.query.limit = 5;
  req.query.order = 'price,-ratingsAverage';
  next();
};

exports.getStats = asyncCatch(async (request, response) => {
  let stats = await tourModel.aggregate([
    { $match: {} },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRaters: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  response.status(200).json({ status: 'success', result: stats });
});

exports.getMonthlyPlan = asyncCatch(async (req, res) => {
  const year = +req.params.year;

  let data = await tourModel.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        NumberOfTours: {
          $sum: 1,
        },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $limit: 12,
    },
    {
      $sort: {
        NumberOfTours: -1,
      },
    },
  ]);
  res
    .status(200)
    .json({ status: 'success', length: data.length, result: data });
});
