(function() {
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

}).call(this);