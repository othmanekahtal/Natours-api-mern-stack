const validator = require('validator');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { hashPassword, changedAfter, correctPassword } = require('../hooks/ModelsUtils');

// we need to getting schema class in mongoose:
const userSchema = new Schema({
  username: {
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
    maxlength: [26, 'A password must have less or equal then 26 characters'],
    minlength: [10, 'An password must have more or equal then 10 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'please confirm your password'],
    maxlength: [26, 'A password must have less or equal then 26 characters'],
    minlength: [10, 'An password must have more or equal then 10 characters'],
    validate: {
      message: 'Passwords not the same !',
      validator: function(element) {
        return this.password === element;
      }
    }
  },
  updatePasswordAt: Date,
  imageCover: {
    type: String,
    required: [true, 'An user must have a cover image']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});
userSchema.pre('save', hashPassword);
userSchema.methods.correctPassword = correctPassword;
userSchema.methods.changedAfter = changedAfter;
// error happens when we import function in another file
module.exports = mongoose.model('user', userSchema);
