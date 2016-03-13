(function() {
  this.Dimensions = (function() {
    Dimensions.FromVector = function(vec) {
      return new Dimensions(vec.x(), vec.y());
    };

    function Dimensions(width, height) {
      this.vector = new Vector(width, height);
    }

    Dimensions.prototype.equals = function(dOther) {
      return this.vector.equals(dOther.vector);
    };

    Dimensions.prototype.scale = function(factor) {
      var box;
      box = new Dimensions(this.vector.x(), this.vector.y());
      box.mutableScale(factor);
      return box;
    };

    Dimensions.prototype.update = function(width, height) {
      return this.vector.update(width, height);
    };

    Dimensions.prototype.mutableScale = function(factor) {
      return this.vector.mutScale(factor);
    };

    Dimensions.prototype.width = function() {
      return this.vector.x();
    };

    Dimensions.prototype.height = function() {
      return this.vector.y();
    };

    Dimensions.prototype.scaleToFill = function(other) {
      var ratio, ratio_x, ratio_y;
      ratio_x = other.width() / this.width();
      ratio_y = other.height() / this.height();
      ratio = ratio_x > ratio_y ? ratio_x : ratio_y;
      return Dimensions.FromVector(this.vector.scale(ratio));
    };

    Dimensions.prototype.scaleToFit = function(other) {
      var ratio, ratio_x, ratio_y;
      ratio_x = other.width() / this.width();
      ratio_y = other.height() / this.height();
      ratio = ratio_x < ratio_y ? ratio_x : ratio_y;
      return Dimensions.FromVector(this.vector.scale(ratio));
    };

    Dimensions.prototype.centerOffset = function(other) {
      var off_x, off_y;
      off_x = (other.width() - this.width()) / 2.0;
      off_y = (other.height() - this.height()) / 2.0;
      return new Vector(off_x, off_y);
    };

    return Dimensions;

  })();

}).call(this);