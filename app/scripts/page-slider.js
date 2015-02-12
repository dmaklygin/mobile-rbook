window.App || (
  window.App = {});

var PageSlider = function (el, options) {

  var _this = this;

  this.active = true;

  this.$el = $(el);

  this.options = options;

  // background node for animation
  this.$background = $('.page-slider-background');

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
    onSlideChangeEnd: this.constant ? function(){} : function() {
      _this.setBackgroundImage();
    },
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

  this.init();

};

PageSlider.prototype = {

  init: function() {
    var _this = this;

    this.active = true;

    // cache active index
    this.activeIndex = this.swiper.activeIndex;

    // Fix GIF's animation for iOS
    //setTimeout(function () {
    //  _this.toggleGlobe(true);
    //}, 1000);

    // Init Animation Background
    this.initBackground();

    this.process();
  },

  toggleSlider: function () {

    this.$wrapper.off("webkitTransitionEnd");

    if (this.fullsize) {
      this.decrease();
    } else {
      this.increase();
    }
  },

  initBackground: function() {
    var
      slide = this.swiper.getSlide(this.swiper.activeIndex),
      $slide = $(slide),
      $image = $slide.find('.page-slider__image'),
      imagePath = $image.data('image'),
      top = this.$el.css('top'),
      left = this.$el.css('left');

    this.$background
      .removeClass('right')
      .removeClass('left')
      .addClass(this.direction)
      .css({
        top: top,
        left: left,
        width: this.$el.css('width'),
        height: this.$el.css('height')
      });

    //this.$background.find('.page-slider-background__container').css({
    //  'background-image': 'url(' + imagePath + ')',
    //  'background-position': $image.css('background-position')
    //});
    this.$background.find('.page-slider-background__container')
      .attr('src', imagePath)
  },

  setBackgroundImage: function() {
    if (!this.active) return;

    var
      slide = this.swiper.getSlide(this.swiper.activeIndex),
      $slide = $(slide),
      $image = $slide.find('.page-slider__image'),
      imagePath = $image.data('image');

    //this.$background.find('.page-slider-background__container')
    //  .css({
    //    'background-image': 'url(' + imagePath + ')'
    //  });
    this.$background.find('.page-slider-background__container')
      .attr('src', imagePath);

  },

  increase: function () {

    if (this.fullsize) {
      return;
    }

    var _this = this;
    //var $container = _this.$background.find('.page-slider-background__container');

    // First, we need to turn off Globe animation !!!
    _this.toggleGlobe(false);

    //if (this.direction) {
    _this.$background.off('webkitTransitionEnd');
    //Listener to AnimationEnd Event
    _this.$background.on('webkitTransitionEnd', function () {
      var sliderInfo = _this.options.slides[_this.swiper.activeIndex];
      _this.fullsize = true;
      // Set Page_slider to FullScreen mode
      //_this.$wrapper.addClass('page__column_type_fullsized');
      _this.$el.addClass('fullsized');
      // Recalculate swiper dimensions
      _this.swiper.resizeFix(true);
      // Hide Background Node
      // Remove event listener
      _this.$background
        .css({ 'visibility': 'hidden' })
        .off('webkitTransitionEnd');
      // Show Audio Player
      if (sliderInfo.sound) {
        App.showAndPlayAudio(App.getAudioPath(_this.options.id, sliderInfo.sound));
      }
    });

    this.$background
      .show()
      .css({ 'visibility': 'visible'})
      .addClass('fullsized');

    return;
    //}

    //$container.off('webkitTransitionEnd');
    //$container.on('webkitTransitionEnd', function () {
    //  $container.off('webkitTransitionEnd');
    //  var sliderInfo = _this.options.slides[_this.swiper.activeIndex];
    //  _this.fullsize = true;
    //  // Set Page_slider to FullScreen mode
    //  _this.$wrapper.addClass('page__column_type_fullsized');
    //  // Recalculate swiper dimensions
    //  _this.swiper.resizeFix(true);
    //  // Hide Background Node
    //  // Remove event listener
    //  _this.$background
    //    .css({ 'visibility': 'hidden' })
    //    .off('webkitTransitionEnd');
    //  // Show Audio Player
    //  if (sliderInfo.sound) {
    //    App.showAndPlayAudio(App.getAudioPath(_this.options.id, sliderInfo.sound));
    //  }
    //});
    //
    //var
    //  slide = this.swiper.getSlide(this.swiper.activeIndex),
    //  $slide = $(slide),
    //  width = $slide.outerWidth(),
    //  height = $slide.outerHeight(),
    //  position = this.$background.position(),
    //  containerWidth = $container.outerWidth(),
    //  containerHeight = $container.outerHeight(),
    //  scaleLeft = -1 * ( position.left - Math.floor((1024 - width) / 2)),
    //  scaleTop = -1 * ( position.top - Math.floor((768 - height) / 2)),
    //
    //  containerScaleLeft = -1 * ( containerWidth - containerWidth * (width / 1024) ) / 2,
    //  containerScaleTop = -1 * ( containerHeight - containerHeight * (height / 768) ) / 2,
    //  scaleMatrix = $M([ [ 1024 / width,0,0,0], [0, 768 / height,0,0], [0,0,1,0], [scaleLeft,scaleTop,0,1] ]),
    //  scaleContainerMatrix = $M([ [ width / 1024,0,0,0], [0, height / 768,0,0], [0,0,1,0], [containerScaleLeft, containerScaleTop,0,1] ]);
    //
    //var styleMatrix = ['matrix3d('];
    //for (var i = 1; i <= 4; i++) {
    //  for (var j = 1; j <= 4; j++) {
    //    styleMatrix.push(scaleMatrix.e(i,j).toFixed(10) + (i == 4 && j == 4 ? "" : ","));
    //  }
    //}
    //styleMatrix.push(')');
    //
    //var styleContainerMatrix = ['matrix3d('];
    //for (i = 1; i <= 4; i++) {
    //  for (j = 1; j <= 4; j++) {
    //    styleContainerMatrix.push(scaleContainerMatrix.e(i,j).toFixed(10) + (i == 4 && j == 4 ? "" : ","));
    //  }
    //}
    //styleContainerMatrix.push(')');
    //
    //
    //this.$background.addClass('fullsized');
    //this.$background.css({ 'visibility': 'visible', 'transform': styleMatrix.join('') });
    //this.$background.find('.page-slider-background__container').css({ 'transform': styleContainerMatrix.join('') });
  },

  decrease: function () {

    if (!this.fullsize) {
      return;
    }

    var _this = this;
    //var $container = _this.$background.find('.page-slider-background__container');

    // We have to stop Audio at first
    App.hideAndStopAudio();

    this.$background.css({ 'visibility': 'visible' });

    _this.$el
      //.css({ 'visibility': 'hidden' })
      .removeClass('fullsized');

    _this.$background.off('webkitTransitionEnd');
    _this.$background.on('webkitTransitionEnd', function () {
      _this.fullsize = false;
      // Show Swiper
      // Recalculate swiper dimensions
      //_this.$el.css({ 'visibility': 'visible' });
      _this.swiper.resizeFix(true);
      // Hide Background
      _this.$background
        .css({ 'visibility': 'hidden' })
        .off('webkitTransitionEnd');
      // Can Show the Globe
      _this.process();
    });

    _this.$background.removeClass('fullsized');


    // Turn off Page_slider from FullScreen mode


    //$container.off('webkitTransitionEnd');
    //$container.on('webkitTransitionEnd', function () {
    //  $container.off('webkitTransitionEnd');
    //
    //  _this.fullsize = false;
    //  // Show Swiper
    //  // Recalculate swiper dimensions
    //  _this.swiper.resizeFix(true);
    //  // Hide Background
    //  _this.$background
    //    .css({ 'visibility': 'hidden' })
    //    .off('webkitTransitionEnd')
    //    .removeClass('fullsized');
    //  // Can Show the Globe
    //  _this.toggleGlobe(true);
    //});
    //
    //// start animation
    //this.$background.find('.page-slider-background__container').css({ 'transform': 'inherit' });
    //this.$background.css({ 'visibility': 'visible', 'transform': 'inherit' });
  },

  toggleGlobe: function (show) {
    App[show ? 'showGlobe' : 'hideGlobe']();
  },

  process: function () {

    if (!this.active) return;

    var
      oldSliderInfo = this.options.slides[this.activeIndex],
      sliderInfo = this.options.slides[this.swiper.activeIndex];

    if (sliderInfo.map && !this.fullsize) {
      App.showGlobe();
    } else if (oldSliderInfo.map) {
      App.hideGlobe();
    }

    if (sliderInfo.sound && this.fullsize) {
      App.showAndPlayAudio(App.getAudioPath(this.options.id, sliderInfo.sound));
    } else if (oldSliderInfo.sound) {
      App.hideAndStopAudio();
    }
  },

  reset: function () {

    var _this = this;

    if (this.constant) {
      return;
    }

    this.active = false;

    this.$el.removeClass('fullsized');
    this.$el.off('webkitTransitionEnd');
    this.swiper.resizeFix(true);

    // unset fullsize
    this.$background.removeClass('fullsized');

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
