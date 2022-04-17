const asyncCatch = require('../utils/asyncCatch');
const QueryHandler = require('../utils/queryHandler');

const errorHandler = require('../utils/errorHandler');
exports.deleteOne = ({ model }) =>
  asyncCatch(async (request, response, next) => {
    const id = request.params.id;
    const doc = await model.findByIdAndDelete(id);
    if (!doc)
      return next(
        new errorHandler({ message: 'ID Not found !', statusCode: 404 })
      );
    // findById only for getting data with Id, we have also findOne
    response.status(204).send(null);
  });

exports.updateOne = ({ model }) =>
  asyncCatch(async (request, response, next) => {
    const id = request.params.id;
    const doc = await model.findByIdAndUpdate(id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!doc)
      return next(
        new errorHandler({ message: 'ID Not found !', statusCode: 404 })
      );
    // findById only for getting data with ID,we have also findOne
    response.status(200).json({ status: 'success', data: doc });
  });

exports.createOne = ({ model }) =>
  asyncCatch(async (request, response) => {
    const doc = await model.create(request.body);
    response.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = ({ model }) =>
  asyncCatch(async (request, response, next) => {
    const id = request.params.id;
    const doc = await model.findById(id);
    // findById only for getting data with ID, we have also findOne

    if (!doc)
      return next(
        new errorHandler({ message: 'ID Not found !', statusCode: 404 })
      );

    response.status(200).json({ status: 'success', data: doc });
  });

exports.getAll = ({ model }) =>
  asyncCatch(async (request, response) => {
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;
    let prep = new QueryHandler(tourModel.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await prep.query;
    response
      .status(200)
      .json({ status: 'success', result: docs.length, data: docs });
  });
