const tourModel = require('../models/tourModel');

// we need to excluded some fields in query like a page and limit and ...

/*
* to implement operators in queries we do (example:duration>=12 - duration[gte]=12)
* sorting in moongose is very simple : asc + and desc -
* TO LIMIT FIELDS AND EXCLUDED IT YOU NEED TO ADD - IN SELECT
* TO HIDE FIELDS YOU NEED TO ADD SELECT:FALSE IN MODEL
* always add await when you interact with mongodb
*/
exports.getAllTours = async (request, response) => {
  let query = { ...request.query };
  const excluded = ['limit', 'page', 'order', 'fields'];
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 100;
  const skip = (page - 1) * limit;
  const numTours = await tourModel.countDocuments();
  excluded.forEach(el => delete query[el]);
  query = JSON.stringify(query).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  console.log(`origin : ${JSON.stringify(request.query)} - new : ${query}`);
  try {
    let prep = tourModel.find(JSON.parse(query));
    if (request.query.order) {
      prep.sort(request.query.order.split(',').join(' '));
    } else {
      // sorted by date the newest to oldest
      prep.sort('-createdAt');
    }
    if (request.query.fields) {
      prep = prep.select(request.query.fields.split(',').join(' '));
    } else {
      prep = prep.select('-__v');
    }
    prep = prep.skip(skip).limit(limit);
    if (request.query.page && skip >= numTours) new Error('This page does not exists !');
    const tours = await prep;
    response.status(200).json({ status: 'success', result: tours.length, data: tours });
  } catch (e) {
    response.status(500).json({
      message: 'fail',
      data: e
    });
  }
};


exports.createTour = async (request, response) => {
  try {
    const new_tour = await tourModel.create(request.body);
    response.status(201).json({
      status: 'success',
      data: new_tour
    });
  } catch (e) {
    response.status(500).json({
      status: 'fail',
      data: e
    });
  }
};

exports.getTour = async (request, response) => {
  const id = request.params.id;
  try {
    const res = await tourModel.findById(id);
    // findById only for getting data with Id, we have also findOne
    if (!res) response.status(404).json({ status: 'fail', data: 'not found' });
    response.status(200).json({ status: 'success', data: res });
  } catch (e) {
    response.status(500).json({ status: 'fail', data: e });
  }
};

exports.updateTour = async (request, response) => {
  const id = request.params.id;
  try {
    const res = await tourModel.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });
    // findById only for getting data with Id, we have also findOne
    response.status(200).json({ status: 'success', data: res });
  } catch (e) {
    response.status(404).json({ status: 'fail', data: e });
  }
};

exports.deleteTour = async (request, response) => {
  const id = request.params.id;
  try {
    await tourModel.findByIdAndDelete(id);
    // findById only for getting data with Id, we have also findOne
    response.status(204).send(null);
  } catch (e) {
    response.status(404).json({ status: 'fail', data: e });
  }
};
exports.getTopAlias = async (req, res, next) => {
  req.query.limit = 5;
  req.query.order = 'price,-ratingsAverage';
  next();
};
