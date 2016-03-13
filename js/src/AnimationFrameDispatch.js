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

}).call(this);