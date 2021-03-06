(function() {
  this.ScalableBezier = (function() {
    ScalableBezier.FromAttribute = function(element, attribute) {
      var attr, test;
      test = element.attributes.getNamedItem(attribute);
      if (test === null) {
        return null;
      }
      attr = test.value.split(' ').map(parseFloat);
      if (attr.length < 8) {
        throw "bezier requires 8 points";
      }
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(ScalableBezier, attr, function(){});
    };

    function ScalableBezier(startX, startY, controlX1, controlY1, controlX2, controlY2, endX, endY) {
      this.startX = startX;
      this.startY = startY;
      this.controlX1 = controlX1;
      this.controlY1 = controlY1;
      this.controlX2 = controlX2;
      this.controlY2 = controlY2;
      this.endX = endX;
      this.endY = endY;
      null;
    }

    ScalableBezier.prototype.clone = function() {
      return new ScalableBezier(this.startX, this.startY, this.controlX1, this.controlY1, this.controlX2, this.controlY2, this.endX, this.endY);
    };

    ScalableBezier.prototype.scale = function(scaleX, scaleY) {
      var newBezier;
      newBezier = this.clone();
      newBezier.mutateScale(scaleX, scaleY);
      return newBezier;
    };

    ScalableBezier.prototype.mutateScale = function(scaleX, scaleY) {
      this.startX *= scaleX;
      this.startY *= scaleY;
      this.controlX1 *= scaleX;
      this.controlY1 *= scaleY;
      this.controlX2 *= scaleX;
      this.controlY2 *= scaleY;
      this.endX *= scaleX;
      return this.endY *= scaleY;
    };

    ScalableBezier.prototype.applyToCanvas = function(context, offsetX, offsetY) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      context.lineTo(offsetX + this.startX, offsetY + this.startY);
      return context.bezierCurveTo(this.controlX1 + offsetX, this.controlY1 + offsetY, this.controlX2 + offsetX, this.controlY2 + offsetY, this.endX + offsetX, this.endY + offsetY);
    };

    ScalableBezier.prototype.renderPoints = function(context, offsetX, offsetY, color) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      if (color == null) {
        color = "#F00";
      }
      context.fillStyle = color;
      context.fillRect(this.startX + offsetX, this.startY + offsetY, 5, 5);
      context.fillRect(this.controlX1 + offsetX, this.controlY1 + offsetY, 5, 5);
      context.fillRect(this.controlX2 + offsetX, this.controlY2 + offsetY, 5, 5);
      return context.fillRect(this.endX + offsetX, this.endY + offsetY, 5, 5);
    };

    ScalableBezier.prototype.reverse = function() {
      var newBezier;
      newBezier = this.clone();
      newBezier.mutableReverse();
      return newBezier;
    };

    ScalableBezier.prototype.mutableReverse = function() {
      var tmp;
      tmp = this.startX;
      this.startX = this.endX;
      this.endX = tmp;
      tmp = this.startY;
      this.startY = this.endY;
      this.endY = tmp;
      tmp = this.controlX1;
      this.controlX1 = this.controlX2;
      this.controlX2 = tmp;
      tmp = this.controlY1;
      this.controlY1 = this.controlY2;
      return this.controlY2 = tmp;
    };

    return ScalableBezier;

  })();

}).call(this);