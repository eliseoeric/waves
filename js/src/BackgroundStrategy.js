(function() {
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

}).call(this);