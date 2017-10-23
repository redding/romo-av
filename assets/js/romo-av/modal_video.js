$.fn.romoModalVideo = function() {
  return $.map(this, function(element) {
    return new RomoModalVideo(element);
  });
}

var RomoModalVideo = function(element) {
  this.elem = $(element);

  this.doInit();
  this._bindElem();

  this.elem.trigger('romoModalVideo:ready', [this]);
}

RomoModalVideo.prototype.doInit = function() {
  // override as needed
}

// private

RomoModalVideo.prototype._bindElem = function() {
  this._bindModal();
  this._bindVideo();

  this.elem.on('romoModal:loadBodySuccess', $.proxy(function(e, data, romoModal) {
    this._bindVideo();
  }, this));
}

RomoModalVideo.prototype._bindModal = function() {
  this.romoModal = this.elem.romoModal()[0];

  if (this.elem.data('romo-modal-clear-content') === undefined) {
    this.elem.attr('data-romo-modal-clear-content', 'true');
  }

  // modal/video interactions

  this.elem.on('romoModalVideo:romoVideo:loadedmetadata', $.proxy(function(e, videoObj, romoVideo, romoModalVideo) {
    this.romoModal.doPlacePopupElem();
  }, this));

  this.elem.on('romoModalVideo:romoVideo:enterFullscreen', $.proxy(function(e, videoObj, romoVideo, romoModalVideo) {
    // wait 1 sec then turn off modal body elem events - since we are in fullscreen
    // mode, we don't care about them
    setTimeout($.proxy(function() {
      this.romoModal.doUnBindWindowBodyClick();
      this.romoModal.doUnBindWindowBodyKeyUp();
      this.romoModal.doUnBindElemKeyUp();
    }, this), 1000);
  }, this));
  this.elem.on('romoModalVideo:romoVideo:exitFullscreen', $.proxy(function(e, videoObj, romoVideo, romoModalVideo) {
    // wait 1 sec then turn on modal body elem events - since we are no longer
    // in fullscreen mode, we need to care about them again
    setTimeout($.proxy(function() {
      this.romoModal.doBindWindowBodyClick();
      this.romoModal.doBindWindowBodyKeyUp();
      this.romoModal.doBindElemKeyUp();
    }, this), 1000);
  }, this));

  // event proxies

  this.elem.on('romoModal:ready', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:ready', [romoModal, this]);
  }, this));
  this.elem.on('romoModal:toggle', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:toggle', [romoModal, this]);
  }, this));
  this.elem.on('romoModal:popupOpen', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:popupOpen', [romoModal, this]);
  }, this));
  this.elem.on('romoModal:popupClose', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:popupClose', [romoModal, this]);
  }, this));
  this.elem.on('romoModal:dragStart', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:dragStart', [romoModal, this]);
  }, this));
  this.elem.on('romoModal:dragMove', $.proxy(function(e, placeX, placeY, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:dragMove', [placeX, placeY, romoModal, this]);
  }, this));
  this.elem.on('romoModal:dragStop', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:dragStop', [romoModal, this]);
  }, this));
  this.elem.on('romoModal:loadBodyStart', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:loadBodyStart', [romoModal, this]);
  }, this));
  this.elem.on('romoModal:loadBodySuccess', $.proxy(function(e, data, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:loadBodySuccess', [data, romoModal, this]);
  }, this));
  this.elem.on('romoModal:loadBodyError', $.proxy(function(e, xhr, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:loadBodyError', [xhr, romoModal, this]);
  }, this));
  this.elem.on('romoModal:dismiss', $.proxy(function(e, romoModal) {
    this.elem.trigger('romoModalVideo:romoModal:dismiss', [romoModal, this]);
  }, this));
}

RomoModalVideo.prototype._bindVideo = function() {
  this.romoVideo = undefined;

  var videoElem = this.romoModal.popupElem.find('[data-romo-video-auto="modalVideo"]');

  this._bindVideoElemEvents(videoElem);
  this._bindModalVideoTriggerEvents();

  this.romoVideo = videoElem.romoVideo()[0];
}

RomoModalVideo.prototype._bindVideoElemEvents = function(videoElem) {
  // playback events

  videoElem.on('romoVideo:play', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:play', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:pause', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:pause', [videoObj, romoVideo, this]);
  }, this));

  // state events

  videoElem.on('romoVideo:playing', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:playing', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:waiting', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:waiting', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:ended',  $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:ended', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:emptied', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:emptied', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:error', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:error', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:stalled', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:stalled', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:suspend', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:suspend', [videoObj, romoVideo, this]);
  }, this));

  // status events

  videoElem.on('romoVideo:progress', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:progress', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:timeupdate', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:timeupdate', [videoObj, romoVideo, this]);
  }, this));

  // settings events

  videoElem.on('romoVideo:volumechange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:volumechange', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:durationchange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:durationchange', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:ratechange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:ratechange', [videoObj, romoVideo, this]);
  }, this));

  // fullscreen events

  videoElem.on('romoVideo:enterFullscreen', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:enterFullscreen', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:exitFullscreen', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:exitFullscreen', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:fullscreenChange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:fullscreenChange', [videoObj, romoVideo, this]);
  }, this));

  // load events

  videoElem.on('romoVideo:loadstart', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:loadstart', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:loadedmetadata', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:loadedmetadata', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:loadeddata', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:loadeddata', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:canplay', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:canplay', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:canplaythrough', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoModalVideo:romoVideo:canplaythrough', [videoObj, romoVideo, this]);
  }, this));
}

RomoModalVideo.prototype._bindModalVideoTriggerEvents = function() {
  // playback triggers

  this.elem.on('romoModalVideo:romoVideo:triggerPlay', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerPlay', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerPause', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerPause', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerTogglePlay', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerTogglePlay', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerSetPlaybackToTime', $.proxy(function(e, secondNum) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackToTime', [secondNum]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerSetPlaybackToFrame', $.proxy(function(e, frameNum) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackToFrame', [frameNum]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerSetPlaybackToPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackToPercent', [percent]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerModPlaybackByTime', $.proxy(function(e, secondsCount) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackByTime', [secondsCount]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerModPlaybackByFrames', $.proxy(function(e, frameCount) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackByFrames', [frameCount]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerModPlaybackByPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackByPercent', [percent]);
    }
  }, this));

  // settings triggers

  this.elem.on('romoModalVideo:romoVideo:triggerMute', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerMute', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerUnmute', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerUnmute', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerToggleMute', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerToggleMute', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerSetVolumeToPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetVolumeToPercent', [percent]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerModVolumeByPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModVolumeByPercent', [percent]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerSetPlaybackRate', $.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackRate', [rate]);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerModPlaybackRate', $.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackRate', [rate]);
    }
  }, this));

  // fullscreen triggers

  this.elem.on('romoModalVideo:romoVideo:triggerEnterFullscreen', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerEnterFullscreen', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerExitFullscreen', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerExitFullscreen', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerToggleFullscreen', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerToggleFullscreen', []);
    }
  }, this));

  // load triggers

  this.elem.on('romoModalVideo:romoVideo:triggerLoad', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerLoad', []);
    }
  }, this));
  this.elem.on('romoModalVideo:romoVideo:triggerModSource', $.proxy(function(e, source) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModSource', [source]);
    }
  }, this));
}

Romo.onInitUI(function(e) {
  Romo.initUIElems(e, '[data-romo-modalVideo-auto="true"]').romoModalVideo();
});
