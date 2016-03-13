(function() {
  if (this.Waves == null) {
    this.Waves = {};
  }

  this.Waves.BezierMask = (function() {
    var abs;

    abs = Math.abs;

    BezierMask.fromElementAttributes = function(element) {
      var bottom, top;
      top = ScalableBezier.FromAttribute(element, 'data-top');
      bottom = ScalableBezier.FromAttribute(element, 'data-bottom');
      return new Waves.BezierMask(top, bottom);
    };

    BezierMask.prototype.updateCanvasDimensions = function(dims) {
      this.clipCanvas.width = dims.width;
      return this.clipCanvas.height = this.totalHeight(dims);
    };

    function BezierMask(top, bottom) {
      this.top = top != null ? top : null;
      this.bottom = bottom != null ? bottom : null;
      this.createClipCanvas();
      this.lastDims = null;
    }

    BezierMask.prototype.createClipCanvas = function() {
      this.clipCanvas = document.createElement('canvas');
      this.clipCanvas.width = 1;
      this.clipCanvas.height = 1;
      return this.clipContext = this.clipCanvas.getContext('2d');
    };

    BezierMask.prototype.updateClippingCanvas = function(dims) {
      this.updateCanvasDimensions(dims);
      this.clipContext.beginPath();
      this.drawTop(dims);
      this.drawBottom(dims);
      this.clipContext.closePath();
      return this.clipContext.fill();
    };

    BezierMask.prototype.drawTop = function(dims) {
      var topBezier;
      if (this.top !== null) {
        topBezier = this.top.scale(dims.width, abs(dims.topMargin));
        this.clipContext.moveTo(topBezier.startX, topBezier.startY);
        return topBezier.applyToCanvas(this.clipContext);
      } else {
        this.clipContext.moveTo(0, 0);
        return this.clipContext.lineTo(dims.width, 0);
      }
    };

    BezierMask.prototype.drawBottom = function(dims) {
      var bottomBezier;
      if (this.bottom !== null) {
        bottomBezier = this.bottom.scale(dims.width, abs(dims.bottomMargin)).reverse();
        return bottomBezier.applyToCanvas(this.clipContext, 0, dims.height + abs(dims.topMargin));
      } else {
        this.clipContext.lineTo(dims.width, this.totalHeight(dims));
        return this.clipContext.lineTo(0, this.totalHeight(dims));
      }
    };

    BezierMask.prototype.drawClippingShape = function(context, dims) {
      var fullDims;
      fullDims = {
        w: dims.width,
        h: this.totalHeight(dims)
      };
      if (this.lastDims === null || !this.dimensionsMatch(this.lastDims, fullDims)) {
        this.updateClippingCanvas(dims);
      }
      this.lastDims = fullDims;
      context.save();
      context.globalCompositeOperation = 'destination-in';
      context.drawImage(this.clipContext.canvas, 0, 0, fullDims.w, fullDims.h);
      return context.restore();
    };

    BezierMask.prototype.dimensionsMatch = function(last, latest) {
      return last.w === latest.w && last.h === latest.h;
    };

    BezierMask.prototype.totalHeight = function(dims) {
      return dims.height + abs(dims.topMargin) + abs(dims.bottomMargin);
    };

    return BezierMask;

  })();

}).call(this);