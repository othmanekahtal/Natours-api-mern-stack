const slugify = require('slugify');
exports.find = function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
  next();
};
exports.slug = function(next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
};