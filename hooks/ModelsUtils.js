const bcrypt = require('bcryptjs');
const slugify = require('slugify');
exports.find = function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
};
exports.slug = function(next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
};
// before aggregate, we need to execute all VIP or secret tours
exports.aggregate = function(next) {
  // to get all pipeline here
  console.log(this.pipeline());
  this.pipeline().unshift(
    {
      $match: {
        secretTour: { $ne: true }
      }
    }
  );
  next();
};
exports.hashPassword = async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
};
exports.correctPassword = async ({
                                   candidatePassword,
                                   userPassword
                                 }) => await bcrypt.compare(userPassword, candidatePassword);

exports.changedAfter = async ({ date }) => {
  if (this.updatePasswordAt) {
    const parsedDate = this.updatePasswordAt.getTime() / 1000;
    return parsedDate > date;
  }
  return false;
};