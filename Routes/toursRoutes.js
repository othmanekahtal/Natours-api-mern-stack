const { getAllTours, createTour, getTour, updateTour, deleteTour } = require('../Controllers/Tour');
const express = require('express');
const router = express.Router();

router.param('id', (req, res, next, value) => {
  console.log(`the id is ${value}`);
  next();
});
// you can us this method fr checking the IDs is valid or not
router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id/')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
