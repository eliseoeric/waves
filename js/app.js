(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.Waves == null) {
    this.Waves = {};
  }

  this.Waves.AnimationFrameDispatch = (function() {
    function AnimationFrameDispatch() {
      this.frame = __bind(this.frame, this);
      this.onResizeEvent = __bind(this.onResizeEvent, this);
      this.waveElementList = [];
      this.resize_flagged = true;
      this.running = false;
      this.raf_confirmed = false;
      window.addEventListener('resize', this.onResizeEvent);
    }

    AnimationFrameDispatch.prototype.onResizeEvent = function() {
      this.resize_flagged = true;
      if (!this.raf_confirmed) {
        this.resizeAll();
        return this.redraw(0, true);
      }
    };

    AnimationFrameDispatch.prototype.register = function(element) {
      this.waveElementList.push(element);
      if (!this.running) {
        this.running = true;
        return requestAnimationFrame(this.frame);
      }
    };

    AnimationFrameDispatch.prototype.frame = function(timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      this.raf_confirmed = true;
      this.running = true;
      requestAnimationFrame(this.frame);
      if (this.needsResize()) {
        this.resizeAll();
        return this.redraw(timestamp, true);
      } else {
        return this.redraw(timestamp);
      }
    };

    AnimationFrameDispatch.prototype.redraw = function(timestamp, force) {
      var item, _i, _len, _ref, _results;
      if (force == null) {
        force = false;
      }
      _ref = this.waveElementList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (force || item.needsAnimation()) {
          _results.push(item.draw(timestamp));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AnimationFrameDispatch.prototype.needsResize = function() {
      if (!this.resize_flagged) {
        return false;
      }
      this.resize_flagged = false;
      return true;
    };

    AnimationFrameDispatch.prototype.resizeAll = function() {
      var item, _i, _len, _ref, _results;
      _ref = this.waveElementList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(item.resize());
      }
      return _results;
    };

    return AnimationFrameDispatch;

  })();

}).call(this);;(function() {
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

}).call(this);;(function() {
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

}).call(this);;(function() {
  this.BackgroundStrategy = (function() {
    BackgroundStrategy.Factory = function(attribute_string) {
      var error, segments;
      if (attribute_string == null) {
        attribute_string = 'solid #000';
      }
      if (typeof attribute_string !== 'string') {
        throw "attribute_string is not a string";
      }
      segments = attribute_string.split(' ');
      if (segments.length < 2) {
        throw "background attribute format is \"type [params...]\" with minimum of one parameter.";
      }
      switch (segments[0]) {
        case 'solid':
          return new SolidBackground(segments[1]);
        case 'video':
          try {
            return new VideoBackground(segments[1]);
          } catch (_error) {
            error = _error;
            if (error === "No HTML5 video support detected") {
              return new ImageBackground(segments[1] + '.jpg');
            } else {
              throw error;
            }
          }
          break;
        case 'image':
          if (segments.length === 2) {
            return new ImageBackground(segments[1]);
          } else {
            return new ImageBackground(segments.slice(1));
          }
          break;
        default:
          throw "\"" + segments[0] + "\" is not a valid background type";
      }
    };

    function BackgroundStrategy() {
      this.lastBox = null;
      this.ready = false;
      this.requiresRedrawing = false;
      this.callback = null;
    }

    BackgroundStrategy.prototype.getDimensions = function(element) {
      if (element instanceof HTMLVideoElement) {
        return new Dimensions(element.videoWidth, element.videoHeight);
      }
      if (element instanceof HTMLImageElement) {
        return new Dimensions(element.naturalWidth, element.naturalHeight);
      }
      return new Dimensions(element.width, element.height);
    };

    BackgroundStrategy.prototype.sourceBox = function(dCanvas, dSource) {
      var offset, scaledCanvasBox;
      scaledCanvasBox = dCanvas.scaleToFit(dSource);
      offset = scaledCanvasBox.centerOffset(dSource);
      return {
        source: {
          x: Math.floor(offset.x()),
          y: Math.floor(offset.y())
        },
        dims: {
          width: Math.floor(scaledCanvasBox.width()),
          height: Math.floor(scaledCanvasBox.height())
        }
      };
    };

    BackgroundStrategy.prototype.getRenderBox = function(dCanvas, sourceElement) {
      var box, imageDims;
      if (this.lastBox !== null && dCanvas.equals(this.lastDims)) {
        box = this.lastBox;
      } else {
        this.lastDims = dCanvas;
        imageDims = this.getDimensions(sourceElement);
        this.lastBox = this.sourceBox(dCanvas, imageDims);
        if (this.lastBox.source.x < 0) {
          this.lastBox.source.x = 0;
        }
        if (this.lastBox.source.y < 0) {
          this.lastBox.source.y = 0;
        }
        if (this.lastBox.dims.height > imageDims.height()) {
          this.lastBox.dims.height = imageDims.height();
        }
        if (this.lastBox.dims.width > imageDims.width()) {
          this.lastBox.dims.width = imageDims.width();
        }
        box = this.lastBox;
      }
      return box;
    };

    BackgroundStrategy.prototype.renderToCanvas = function(element, context, dTime) {
      if (dTime == null) {
        dTime = 0;
      }
      return null;
    };

    BackgroundStrategy.prototype.setCallback = function(fn) {
      return null;
    };

    return BackgroundStrategy;

  })();

}).call(this);;(function() {
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

}).call(this);;(function() {
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

}).call(this);;(function() {
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

}).call(this);;(function() {
  if (this.Waves == null) {
    this.Waves = {};
  }

  this.Waves.ElementDimensions = (function() {
    var abs, ceil;

    abs = Math.abs;

    ceil = Math.ceil;

    function ElementDimensions() {
      this.width = 0;
      this.height = 0;
      this.topMargin = 0;
      this.bottomMargin = 0;
      this.totalHeight = 0;
    }

    ElementDimensions.prototype.updateFromElement = function(element) {
      var style;
      style = element.currentStyle || window.getComputedStyle(element);
      this.width = ceil(element.offsetWidth);
      this.height = ceil(element.offsetHeight);
      this.topMargin = ceil(parseFloat(style.marginTop));
      this.bottomMargin = ceil(parseFloat(style.marginBottom));
      if (isNaN(this.topMargin)) {
        this.topMargin = 0;
      }
      if (isNaN(this.bottomMargin)) {
        this.bottomMargin = 0;
      }
      this.totalHeight = this.height + abs(this.topMargin) + abs(this.bottomMargin);
      return this;
    };

    return ElementDimensions;

  })();

}).call(this);;(function() {
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

}).call(this);;(function() {
  if (this.Waves == null) {
    this.Waves = {};
  }

  this.Waves.TemporaryCanvas = (function() {
    function TemporaryCanvas() {
      this.internalCanvas = document.createElement('canvas');
      this.internalContext = this.internalCanvas.getContext('2d');
    }

    TemporaryCanvas.prototype.copyCanvas = function(otherCanvas) {
      this.internalCanvas.width = otherCanvas.width;
      this.internalCanvas.height = otherCanvas.height;
      return this.internalContext.drawImage(otherCanvas, 0, 0);
    };

    TemporaryCanvas.prototype.restoreToContext = function(otherContext) {
      var otherCanvas;
      otherCanvas = otherContext.canvas;
      return otherContext.drawImage(this.internalCanvas, 0, 0, otherCanvas.width, otherCanvas.height);
    };

    return TemporaryCanvas;

  })();

}).call(this);;(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.WaveElement = (function() {
    WaveElement.FrameDispatch = new Waves.AnimationFrameDispatch();

    function WaveElement(element) {
      this.element = element;
      this.draw = __bind(this.draw, this);
      this.redraw_needed = false;
      this.transitions = [];
      this.compositeSupported = this.isCompositeSupported();
      this.element.style.position = 'relative';
      this.bezierMask = Waves.BezierMask.fromElementAttributes(this.element);
      this.loadBackground(this.element);
      this.createCanvas();
      this.removeLoadingClass(this.element);
      WaveElement.FrameDispatch.register(this);
    }

    WaveElement.prototype.removeLoadingClass = function(element) {
      return element.className = element.className.replace(/\bwib-loading\b/, '');
    };

    WaveElement.prototype.isCompositeSupported = function() {
      var ctx, test;
      test = document.createElement('canvas');
      ctx = test.getContext('2d');
      ctx.globalCompositeOperation = 'destination-in';
      return ctx.globalCompositeOperation === 'destination-in';
    };

    WaveElement.prototype.loadBackground = function(element) {
      var attribute,
        _this = this;
      attribute = element.attributes.getNamedItem('data-background');
      if (attribute === null) {
        throw "missing required data-background attribute";
      }
      this.background = BackgroundStrategy.Factory(attribute.value);
      return this.background.setCallback(function() {
        return _this.redraw_needed = true;
      });
    };

    WaveElement.prototype.createCanvas = function() {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.canvas.style.position = "absolute";
      this.canvas.style.left = 0;
      this.canvas.style.top = 0;
      this.canvas.style.zIndex = -1;
      return this.element.appendChild(this.canvas);
    };

    WaveElement.prototype.getElementDimensions = function(element) {
      if (this.elementDims == null) {
        this.elementDims = new Waves.ElementDimensions;
      }
      return this.elementDims.updateFromElement(element);
    };

    WaveElement.prototype.resize = function() {
      var dims;
      dims = this.getElementDimensions(this.element);
      this.canvas.style.top = "" + dims.topMargin + "px";
      if (this.tmpCanvas == null) {
        this.tmpCanvas = new Waves.TemporaryCanvas;
      }
      this.tmpCanvas.copyCanvas(this.canvas);
      this.canvas.width = dims.width;
      this.canvas.height = dims.totalHeight;
      this.canvas.style.width = "" + dims.width + "px";
      this.canvas.style.height = "" + dims.totalHeight + "px";
      return this.tmpCanvas.restoreToContext(this.context);
    };

    WaveElement.prototype.isVisible = function() {
      if (this.canvasLayer == null) {
        this.canvasLayer = new Waves.Layer(0, 0, 0, 0);
      }
      this.canvasLayer.updateFromElement(this.canvas);
      return Waves.Layer.Viewport().intersects(this.canvasLayer);
    };

    WaveElement.prototype.needsAnimation = function() {
      if (!this.isVisible()) {
        return false;
      }
      if (this.redraw_needed) {
        return true;
      }
      if (this.background.requiresRedrawing) {
        return true;
      }
      if (this.transitions.length > 0) {
        return true;
      }
      return false;
    };

    WaveElement.prototype.draw = function(timestamp) {
      var dims;
      if (timestamp == null) {
        timestamp = 0;
      }
      this.drawing = true;
      this.redraw_needed = false;
      dims = this.getElementDimensions(this.element);
      this.background.renderToCanvas(this.canvas, this.context, timestamp);
      if (this.compositeSupported) {
        this.bezierMask.drawClippingShape(this.context, dims);
      }
      this.processTransitions(dims, timestamp);
      return this.drawing = false;
    };

    WaveElement.prototype.processTransitions = function(dimensions, timestamp) {
      var old_required_animation, transition, _i, _len, _ref;
      if (this.transitions.length === 0) {
        return;
      }
      if (timestamp === 0) {
        return;
      }
      _ref = this.transitions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        transition = _ref[_i];
        transition.process(this.canvas, this.context, dimensions, timestamp);
      }
      old_required_animation = this.background.requiresRedrawing;
      while (true) {
        if (this.transitions.length === 0) {
          break;
        }
        if (this.transitions[this.transitions.length - 1].finished) {
          this.background = this.transitions.pop().background;
        } else {
          break;
        }
      }
      if (!old_required_animation && this.background.requiresRedrawing) {
        return this.redraw_needed = true;
      }
    };

    WaveElement.prototype.changeBackground = function(backgroundString, duration) {
      var error, new_background, transition;
      if (duration == null) {
        duration = 0;
      }
      try {
        new_background = BackgroundStrategy.Factory(backgroundString);
      } catch (_error) {
        error = _error;
        console.log(error);
        return;
      }
      if (duration === 0) {
        this.background = new_background;
      } else {
        transition = new BackgroundTransition(new_background, duration);
        this.transitions.unshift(transition);
      }
      return this.redraw_needed = true;
    };

    return WaveElement;

  })();

}).call(this);;(function() {
  var WavyJs, requestAnimationFrame, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  requestAnimationFrame = root.requestAnimationFrame || root.mozRequestAnimationFrame || root.webkitRequestAnimationFrame || root.msRequestAnimationFrame;

  WavyJs = (function() {
    function WavyJs($, options) {
      var key, val;
      this.$ = $;
      if (options == null) {
        options = {};
      }
      this.tick = __bind(this.tick, this);
      this.elements = [];
      this.options = {
        wavePeriod: 3000,
        xRange: 5,
        yRange: 20,
        rotRange: 5
      };
      for (key in options) {
        val = options[key];
        this.options[key] = val;
      }
    }

    WavyJs.prototype.addElement = function(element, periodOffset) {
      if (periodOffset == null) {
        periodOffset = 0.0;
      }
      return this.elements.push({
        element: this.$(element),
        offset: periodOffset
      });
    };

    WavyJs.prototype.getInfluence = function(elementData, baseProgress) {
      var actualPeriod, influence;
      actualPeriod = 2 * Math.PI * (baseProgress + elementData.offset);
      influence = {
        x: Math.cos(actualPeriod),
        y: Math.sin(actualPeriod)
      };
      return influence;
    };

    WavyJs.prototype.getInfluenceCSS = function(influence) {
      var css, rot, rule, tX, tY;
      tX = influence.x * this.options.xRange;
      tY = influence.y * this.options.yRange;
      rot = influence.x * this.options.rotRange;
      rule = "translateX(" + tX + "px) translateY(" + tY + "px) rotate(" + rot + "deg)";
      css = {
        '-webkit-transform': rule,
        '-moz-transform': rule,
        '-o-transform': rule,
        '-ms-transform': rule,
        'transform': rule
      };
      return css;
    };

    WavyJs.prototype.tick = function(timestamp) {
      var css, influence, item, progress, _i, _len, _ref;
      if (!this.running) {
        return;
      }
      progress = (timestamp % this.options.wavePeriod) / (this.options.wavePeriod * 1.0);
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        influence = this.getInfluence(item, progress);
        css = this.getInfluenceCSS(influence);
        item.element.css(css);
      }
      return requestAnimationFrame(this.tick);
    };

    WavyJs.prototype.start = function() {
      this.running = true;
      return requestAnimationFrame(this.tick);
    };

    WavyJs.prototype.stop = function(doReset) {
      var item, _i, _len, _ref, _results;
      this.running = false;
      if (!doReset) {
        return;
      }
      _ref = this.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(item.element.css(this.getInfluenceCSS({
          x: 0,
          y: 0
        })));
      }
      return _results;
    };

    return WavyJs;

  })();

  root.WavyJs = WavyJs;

}).call(this);;(function() {
	window.waveObjects = [];
	$('.wibbly-section').each(function( idx, el ) {
		return window.waveObjects.push(new WaveElement(el) );
	});

})();