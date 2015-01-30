window.App || (
  window.App = {});

var PageSlider = function (el, options) {

  var _this = this;

  this.$el = $(el);

  this.options = options;

  // wrapper of slider
  this.$wrapper = this.$el.parents('.page__column');

  // is Fullsized screen
  this.fullsize = this.$wrapper.hasClass('page__column_type_fullsized');

  this.constant = this.$el.hasClass('page-slider_type_constant');

  this.direction = this.$el.hasClass('page-slider_align_left') ? 'left' : (
    this.$el.hasClass('page-slider_align_right') ? 'right' : null);

  this.swiper = this.$el.swiper({
    mode: 'horizontal',
    loop: false,
    DOMAnimation: false,
    resistance: '100%',
    wrapperClass: 'page-slider__container',
    slideClass: 'page-slider__item',
    pagination: this.$wrapper.find('.page-slider__pagination')[0],
    onSlideChangeStart: this.process.bind(this),
    onSlideClick: this.constant ? function () {
    } : this.toggleSlider.bind(this),
    onTouchEnd: function () {
      var lastSlideX = _this.swiper.slidesGrid[_this.swiper.slidesGrid.length - 1];
      if (_this.swiper.positions.current <= -lastSlideX && _this.swiper.touches.diff) {
        _this.options.onNext && _this.options.onNext.call(_this);
      } else if (_this.swiper.positions.current >= 0 && _this.swiper.touches.diff) {
        _this.options.onPrev && _this.options.onPrev.call(_this);
      }
    }
  });

  // Fix GIF's animation for iOS
  setTimeout(function () {
    _this.toggleGlobe(true);
  }, 1000);
};

PageSlider.prototype = {

  init: function() {
    var _this = this;
    // Fix GIF's animation for iOS
    setTimeout(function () {
      _this.toggleGlobe(true);
    }, 1000);
  },

  toggleSlider: function () {

    this.$wrapper.off("webkitTransitionEnd");

    if (this.fullsize) {
      this.decrease();
    } else {
      this.increase();
    }
  },

  increase: function () {
    var
      _this = this,
      fix = function () {
        var sliderInfo = _this.options.slides[_this.swiper.activeIndex];
        // Show Audio Player
        if (sliderInfo.sound) {
          App.showAndPlayAudio(App.getAudioPath(_this.options.id, sliderInfo.sound));
        }
        // Show Globe
        _this.toggleGlobe(false);

        _this.fullsize = true;
      };

    if (this.swiper) {
      this.$wrapper.addClass('page__column_type_fullsized');
      this.swiper.resizeFix(true);
      this.$wrapper.addClass('page__column_align_fullscreen');
      fix();
    }
  },

  decrease: function () {
    var
      _this = this,
      fix = function () {
        if (_this.swiper) {
          _this.$wrapper.removeClass('page__column_type_fullsized');
          _this.swiper.resizeFix(true);
          // set fullsize to false
          _this.fullsize = false;
          // Show Globe
          _this.toggleGlobe(true);
        }
      };

    this.$wrapper.removeClass('page__column_align_fullscreen');
    this.$wrapper.on('webkitTransitionEnd', function () {
      _this.$wrapper.off('webkitTransitionEnd');
      fix();
      return false;
    });

    App.hideAndStopAudio();
  },

  toggleGlobe: function (show) {
    var _this = this;
    this.options.slides.forEach(function (sliderInfo, index) {
      if (_this.swiper && sliderInfo.map) {
        var globe = _this.swiper.getSlide(index).querySelector('.page-slider__globe');
        $(globe)[show ? 'show' : 'hide']();
      }
    });
  },

  process: function (slide) {
    if (!this.fullsize) {
      return App.hideAndStopAudio();
    }
    // slider info
    var sliderInfo = this.options.slides[this.swiper.activeIndex];
    // Show Audio Player
    if (sliderInfo.sound) {
      App.showAndPlayAudio(App.getAudioPath(this.options.id, sliderInfo.sound));
    } else {
      App.hideAndStopAudio();
    }
  },

  reset: function () {

    var _this = this;

    if (this.constant) {
      return;
    }

    this.$wrapper.removeClass('page__column_align_fullscreen');
    this.$wrapper.on('webkitTransitionEnd', function () {
      _this.$wrapper.removeClass('page__column_type_fullsized');
      _this.$wrapper.off('webkitTransitionEnd');
      _this.swiper.resizeFix(true);
    });

    // set fullsize to false
    this.fullsize = false;
    // Show Globe
    this.toggleGlobe(false);

    this.swiper.swipeTo(0);
  },

  destroy: function () {
    // Remove additional classes
    this.reset();

    this.swiper.destroy(true);
    this.swiper = null;
    this.$el.off('click');
  }
};

App.PageSlider = PageSlider;
