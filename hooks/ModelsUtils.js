const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const slugify = require('slugify');
const { Schema } = require('mongoose');
const { password } = require('./ModelsUtils');
exports.find = function (next) {
  this.populate({
    path: 'guides',
    select:
      '-__v -passwordChangedAt -passwordResetToken -passwordResetExpires -role -createdAt -updatedAt -updatePasswordAt',
  }).populate({
    path: 'reviews',
    select: '-__v -createdAt -updatedAt',
  });
  this.find({ secretTour: { $ne: true } });
  next();
};
exports.slug = function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
};
// before aggregate, we need to execute all VIP or secret tours
exports.aggregate = function (next) {
  // to get all pipeline here

  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  next();
};
exports.hashPassword = async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
};
exports.correctPassword = async ({ candidatePassword, userPassword }) =>
  await bcrypt.compare(userPassword, candidatePassword);

exports.changedAfter = async ({ date }) => {
  if (this.updatePasswordAt) {
    const parsedDate = this.updatePasswordAt.getTime() / 1000;
    return parsedDate > date;
  }
  return false;
};
exports.createPasswordResetToken = function () {
  const resetTokenUser = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto
    .createHash('sha256')
    .update(resetTokenUser)
    .digest('hex');
  this.resetTokenExpiration = Date.now() + 10 * 60 * 1000;
  return resetTokenUser;
};
exports.willBeActive = function (next) {
  this.find({ active: { $ne: false } });
  next();
};
