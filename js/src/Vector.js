(function() {
  var __slice = [].slice;

  this.Vector = (function() {
    function Vector() {
      var values;
      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.values = values;
      this.values;
    }

    Vector.prototype.clone = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Vector, this.values, function(){});
    };

    Vector.prototype.reverse = function() {
      return this.scale(-1);
    };

    Vector.prototype.scale = function(scalar) {
      var vec;
      vec = this.clone();
      vec.mutScale(scalar);
      return vec;
    };

    Vector.prototype.update = function() {
      var values;
      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.values = values;
      return this;
    };

    Vector.prototype.setX = function(val) {
      return this.values[0] = val;
    };

    Vector.prototype.setY = function(val) {
      return this.values[1] = val;
    };

    Vector.prototype.setZ = function(val) {
      return this.values[2] = val;
    };

    Vector.prototype.mutScale = function(scalar) {
      return this.values = this.values.map(function(x) {
        return x * scalar;
      });
    };

    Vector.prototype.equals = function(other) {
      var idx, val, _i, _len, _ref;
      if (other.values.length !== this.values.length) {
        return false;
      }
      _ref = this.values;
      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
        val = _ref[idx];
        if (other.values[idx] !== val) {
          return false;
        }
      }
      return true;
    };

    Vector.prototype.x = function() {
      if (this.values.length > 0) {
        return this.values[0];
      }
      return null;
    };

    Vector.prototype.y = function() {
      if (this.values.length > 1) {
        return this.values[1];
      }
      return null;
    };

    Vector.prototype.z = function() {
      if (this.values.length > 2) {
        return this.values[2];
      }
      return null;
    };

    return Vector;

  })();

}).call(this);