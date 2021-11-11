const database = require('../config/database.js')();
const { Schema } = database;
// we need to getting schema class in mongoose:
const tourSchema = new Schema({
  title: {
    type: String,
    required: [true, 'we need to specified the name of the tour']
  },
  name: {
    type: String,
    required: [true, 'error message here'],
    unique: true
  }
});
// we need to create a model : mongodb we automatically create a collection using plural of the TourModel and convert them to lowercase

module.exports = database.model('tour', tourSchema);

