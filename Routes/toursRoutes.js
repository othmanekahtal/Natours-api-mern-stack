const { getAllTours, createTour, getTour, updateTour, deleteTour } = require('../Controllers/Tour');
const express = require('express');
const Tours = express.Router();

Tours
  .route('/')
  .get(getAllTours)
  .post(createTour);

Tours
  .route('/:id/')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = Tours;
