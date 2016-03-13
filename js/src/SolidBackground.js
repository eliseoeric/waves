(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.SolidBackground = (function(_super) {
    __extends(SolidBackground, _super);

    function SolidBackground(color) {
      SolidBackground.__super__.constructor.call(this);
      this.color = color;
      this.ready = true;
    }

    SolidBackground.prototype.renderToCanvas = function(element, context, dTime) {
      var dim;
      if (dTime == null) {
        dTime = 0;
      }
      dim = this.getDimensions(element);
      context.fillStyle = this.color;
      return context.fillRect(0, 0, dim.width(), dim.height());
    };

    return SolidBackground;

  })(this.BackgroundStrategy);

}).call(this);