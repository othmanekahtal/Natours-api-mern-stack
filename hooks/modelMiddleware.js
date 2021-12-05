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

