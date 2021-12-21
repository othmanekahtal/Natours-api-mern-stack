const mongoose = require('mongoose');
const { Schema } = mongoose;
const { slug, find, aggregate } = require('../hooks/ModelsUtils');
// we need to getting schema class in mongoose:
const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // to ignore the selection the created at in select
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      select: false,
      default: false
    }
  }
  , {
    toJSON: {
      virtuals: true
    },
    toObject: { virtuals: true }
  });
tourSchema.virtual('duration-week').get(function() {
  return this.duration / 7;
});
// we add slug to the model
tourSchema.pre('save', slug);
// anything start with find (findOne,findByID etc...)
tourSchema.pre(/^find/, find);
// we need to create a model : mongodb we automatically create a collection using plural of the TourModel and convert them to lowercase
tourSchema.pre('aggregate', aggregate);
module.exports = mongoose.model('tour', tourSchema);
