(function() {
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

}).call(this);