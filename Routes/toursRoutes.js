const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  getTopAlias,
  deleteTour,
  getStats,
  getMonthlyPlan,
} = require('../Controllers/tourController');
const express = require('express');
const { reviewRouter } = require('./reviewRoutes');
const router = express.Router();

router.param('id', (req, res, next, value) => {
  next();
});
router.use('/:tourId/reviews', reviewRouter);
// you can us this method fr checking the IDs is valid or not
router.route('/top-5-cheap').get(getTopAlias, getAllTours);
router.route('/tours-stats').get(getStats);
router.route('/get-month/:year/').get(getMonthlyPlan);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id/').get(getTour).patch(updateTour).delete(deleteTour);
module.exports = router;
