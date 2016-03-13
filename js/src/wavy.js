(function() {
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

}).call(this);