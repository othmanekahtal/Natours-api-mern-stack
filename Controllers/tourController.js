const tourModel = require('../models/tourModel');
const QueryHandler = require('../utils/queryHandler');
const errorHandler = require('../utils/errorHandler.js');

// we need to exclude some fields in query like a page and limit and ...

/*
* to implement operators in queries we do (example:duration>=12 - duration[gte]=12)
* sorting in mongoose is very simple : asc + and desc -
* TO LIMIT FIELDS AND EXCLUDED IT YOU NEED TO ADD - IN SELECT
* TO HIDE FIELDS YOU NEED TO ADD SELECT:FALSE IN MODEL
* always add await when you interact with mongodb
*/
exports.getAllTours = async (request, response, next) => {
  try {

    let prep = new QueryHandler(tourModel.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await prep.query;
    console.log(tours);
    response.status(200).json({ status: 'success', result: tours.length, data: tours });
  } catch (e) {
    next(errorHandler.error500({ message: `The resource ${request.originalUrl} not found` }));
  }
};


exports.createTour = async (request, response, next) => {
  try {
    const new_tour = await tourModel.create(request.body);
    response.status(201).json({
      status: 'success',
      data: new_tour
    });
  } catch (e) {
    next(errorHandler.error500({ message: `error happen` }));
  }
};

exports.getTour = async (request, response, next) => {
  const id = request.params.id;
  try {
    const res = await tourModel.findById(id);
    // findById only for getting data with Id, we have also findOne
    if (!res) response.status(404).json({ status: 'fail', data: 'not found' });
    response.status(200).json({ status: 'success', data: res });
  } catch (e) {
    next(errorHandler.error404({ message: `The resource ${request.originalUrl} not found` }));
  }
};

exports.updateTour = async (request, response, next) => {
  const id = request.params.id;
  try {
    const res = await tourModel.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });
    // findById only for getting data with ID,we have also findOne
    response.status(200).json({ status: 'success', data: res });
  } catch (e) {
    next(errorHandler.error404({ message: `The resource ${request.originalUrl} not found` }));
  }
};

exports.deleteTour = async (request, response, next) => {
  const id = request.params.id;
  try {
    await tourModel.findByIdAndDelete(id);
    // findById only for getting data with Id, we have also findOne
    response.status(204).send(null);
  } catch (e) {
    next(errorHandler.error404({ message: `The resource ${request.originalUrl} not found` }));
  }
};
exports.getTopAlias = async (req, res, next) => {
  req.query.limit = 5;
  req.query.order = 'price,-ratingsAverage';
  next();
};

exports.getStats = async (request, response, next) => {
  try {
    let stats = await tourModel.aggregate(
      [
        { $match: {} },
        {
          $group: {
            _id: '$difficulty',
            numTours: { $sum: 1 },
            numRaters: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]
    );
    response.status(200).json({ status: 'success', result: stats });
  } catch (e) {
    next(errorHandler.error500({ message: `error happen` }));
  }
};
exports.getMonthlyPlan = async (req, res, next) => {
  try {
    const year = +req.params.year;
    console.log(year);
    let data = await tourModel.aggregate([{ $unwind: '$startDates' }, {
      $match: {
        startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
      }
    }, {
      $group: {
        _id: {
          $month: '$startDates'
        },
        NumberOfTours: {
          $sum: 1
        },
        tours: {
          $push: '$name'
        }
      }
    }, {
      $addFields: {
        month: '$_id'
      }
    }, {
      $project: {
        _id: 0
      }
    }, {
      $limit: 12
    }, {
      $sort: {
        NumberOfTours: -1
      }
    }]);
    res.status(200).json({ status: 'success', length: data.length, result: data });
  } catch (e) {
    next(errorHandler.error500({ message: `error happen` }));
  }
};