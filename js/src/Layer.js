(function() {
  if (this.Waves == null) {
    this.Waves = {};
  }

  this.Waves.Layer = (function() {
    var elementOffset, viewport;

    viewport = null;

    Layer.Viewport = function() {
      var height, left, top, width;
      if (viewport === null) {
        viewport = new Waves.Layer();
      }
      left = window.pageXOffset;
      top = window.pageYOffset;
      width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      return viewport.update(left, top, width, height);
    };

    elementOffset = function(element) {
      var left, top;
      left = element.offsetLeft;
      top = element.offsetTop;
      while (element = element.offsetParent) {
        left += element.offsetLeft;
        top += element.offsetTop;
      }
      return {
        left: left,
        top: top
      };
    };

    function Layer(left, top, width, height) {
      this.origin = new Vector(left, top);
      this.box = new Dimensions(width, height);
    }

    Layer.prototype.left = function() {
      return this.origin.x();
    };

    Layer.prototype.top = function() {
      return this.origin.y();
    };

    Layer.prototype.width = function() {
      return this.box.width();
    };

    Layer.prototype.height = function() {
      return this.box.height();
    };

    Layer.prototype.right = function() {
      return this.left() + this.width();
    };

    Layer.prototype.bottom = function() {
      return this.top() + this.height();
    };

    Layer.prototype.is_equal_to = function(other) {
      return this.origin.equals(other.origin) && this.box.equals(other.box);
    };

    Layer.prototype.is_equivalent_to = function(other) {
      return this.box.equals(other.box);
    };

    Layer.prototype.intersects = function(other) {
      return this.left() < other.right() && this.top() < other.bottom() && this.right() > other.left() && this.bottom() > other.top();
    };

    Layer.prototype.contains = function(other) {
      return this.left() <= other.left() && this.top() <= other.top() && this.bottom() >= other.bottom() && this.right() >= other.right();
    };

    Layer.prototype.update = function(left, top, width, height) {
      this.origin.update(left, top);
      this.box.update(width, height);
      return this;
    };

    Layer.prototype.updateFromElement = function(element) {
      var offset, rect;
      if (typeof element.getBoundingClientRect === 'function') {
        rect = element.getBoundingClientRect();
        offset = {
          x: window.pageXOffset,
          y: window.pageYOffset
        };
        this.update(rect.left + offset.x, rect.top + offset.y, rect.width, rect.height);
      } else {
        offset = elementOffset(element);
        this.update(offset.left, offset.top, element.offsetWidth, element.offsetHeight);
      }
      return this;
    };

    return Layer;

  })();

}).call(this);