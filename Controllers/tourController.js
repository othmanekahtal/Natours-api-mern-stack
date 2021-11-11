const fs = require('fs');
const tourModel = require('../models/tourModel');

exports.getAllTours = async (request, response) => {
  const tours = await tourModel.find({});
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
