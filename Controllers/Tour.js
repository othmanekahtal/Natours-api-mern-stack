const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (request, response) => {
  response.status(201).json({
    message: 'success',
    result: tours.length,
    data: tours
    /**
     * This is optional only in array with multiple elements (objects)
     */
  });
};

exports.createTour = (request, response) => {
  // console.log(request.body);
  console.log(tours[tours.length - 1]);
  const id = tours[tours.length - 1].id + 1;
  const newTour = { id, ...request.body };
  const newData = [...tours, newTour];
  // console.log(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newData), () => {
    response.status(201).json({
      message: 'success',
      data: newTour
    });
  });
};

exports.getTour = (request, response) => {
  // implementation :
  /**
   * if id is in the array we return it if not we send nit found code page
   */
  const tour = tours.find(tour => tour.id === +request.params.id);
  if (tour) {
    response.status(200).json({ message: 'success', result: tour });
  } else {
    // fist thing we will send is code before data :
    response.status(404).json('not found');
  }
};

exports.updateTour = (request, response) => {
  const id = request.params.id;
  if (tours.some(tour => tour.id === +id)) {
    response.status(201).json({ 'message': 'success', 'result': '<tour updated successfuly>' });
  } else {
    response.status(404).json({ 'message': 'not found' });
  }
};

exports.deleteTour = (request, response) => {
  const id = request.params.id;
  if (tours.some(tour => tour.id === +id)) {
    // 204 no content
    response.status(204).json({ 'message': 'success', 'result': null });
  } else {
    response.status(404).json({ 'message': 'not found' });
  }
};
