const fs = require('fs');
const tourModel = require('../models/tourModel');

exports.getAllTours = async (request, response) => {
  // we need to excluded some fields in query like a page and limit and ...
  /*
  * to implement operators in queries we do (example:duration>=12 - duration[gte]=12)
  * */
  let query = { ...request.query };
  const excluded = ['limit', 'page', 'order', 'fields'];
  excluded.forEach(el => delete query[el]);
  query = JSON.stringify(query).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  console.log(`origin : ${JSON.stringify(request.query)} - new : ${query}`);
  const tours = await tourModel.find(JSON.parse(query));
  try {
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
