(function() {
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

}).call(this);