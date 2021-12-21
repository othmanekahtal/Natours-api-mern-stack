const database = require('../config/database.js')();
const validator = require('validator');
const { Schema } = database;
const { slug, find, aggregate } = require('../hooks/modelMiddleware');
// we need to getting schema class in mongoose:
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'An user must have a username'],
      // unique: true,
      trim: true,
      maxlength: [40, 'An username must have less or equal then 40 characters'],
      minlength: [10, 'An username must have more or equal then 10 characters']
    },
    email: {
      type: String,
      required: [true, 'An user must have an email'],
      unique: true,
      trim: true,
      maxlength: [40, 'An email must have less or equal then 40 characters'],
      minlength: [10, 'An email must have more or equal then 10 characters'],
      // validation:validator.isEm
      validate: {
        message: 'An email is not valid !',
        validator: validator.isEmail
      }
    },
    password: {
      type: String,
      required: [true, 'An user must have an password'],
      trim: true,
      maxlength: [26, 'A password must have less or equal then 26 characters'],
      minlength: [10, 'An password must have more or equal then 10 characters']
    },
    imageCover: {
      type: String,
      required: [true, 'An user must have a cover image']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  }
  // {
  //   toJSON: {
  //     virtuals: true
  //   },
  //   toObject: {
  //     virtuals: true
  //   }
  // }
);
userSchema.virtual('duration-week').get(function() {
  return this.duration / 7;
});
// we add slug to the model
userSchema.pre('save', slug);
// anything start with find (findOne,findByID etc...)
userSchema.pre(/^find/, find);
// we need to create a model : mongodb we automatically create a collection using plural of the TourModel and convert them to lowercase
userSchema.pre('aggregate', aggregate);
module.exports = database.model('user', userSchema);
