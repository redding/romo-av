$.fn.romoModalVideo = function() {
  return $.map(this, function(element) {
    return new RomoModalVideo(element);
  });
}

var RomoModalVideo = function(element) {
  this.elem = $(element);

  this.doInit();
  this._bindElem();

  this.elem.trigger('modalVideo:ready', [this]);
}

RomoModalVideo.prototype.doInit = function() {
  // override as needed
}

// private

RomoModalVideo.prototype._bindElem = function() {
  this._bindModal();
  this._bindVideo();

  this.elem.on('modal:loadBodySuccess', $.proxy(function(e, data, modal) {
    this._bindVideo();
  }, this));
}

RomoModalVideo.prototype._bindModal = function() {
  this.modal = this.elem.romoModal()[0];

  if (this.elem.data('romo-modal-clear-content') === undefined) {
    this.elem.attr('data-romo-modal-clear-content', 'true');
  }

  // modal/video interactions

  this.elem.on('modalVideo:video:loadedmetadata', $.proxy(function(e, videoObj, video, modalVideo) {
    this.modal.doPlacePopupElem();
  }, this));

  this.elem.on('modalVideo:video:enterFullscreen', $.proxy(function(e, videoObj, video, modalVideo) {
    // wait 1 sec then turn off modal body elem events - since we are in fullscreen
    // mode, we don't care about them
    setTimeout($.proxy(function() {
      this.modal.doUnBindWindowBodyClick();
      this.modal.doUnBindWindowBodyKeyUp();
      this.modal.doUnBindElemKeyUp();
    }, this), 1000);
  }, this));
  this.elem.on('modalVideo:video:exitFullscreen', $.proxy(function(e, videoObj, video, modalVideo) {
    // wait 1 sec then turn on modal body elem events - since we are no longer
    // in fullscreen mode, we need to care about them again
    setTimeout($.proxy(function() {
      this.modal.doBindWindowBodyClick();
      this.modal.doBindWindowBodyKeyUp();
      this.modal.doBindElemKeyUp();
    }, this), 1000);
  }, this));

  // event proxies

  this.elem.on('modal:ready', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:ready', [modal, this]);
  }, this));
  this.elem.on('modal:toggle', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:toggle', [modal, this]);
  }, this));
  this.elem.on('modal:popupOpen', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:popupOpen', [modal, this]);
  }, this));
  this.elem.on('modal:popupClose', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:popupClose', [modal, this]);
  }, this));
  this.elem.on('modal:dragStart', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:dragStart', [modal, this]);
  }, this));
  this.elem.on('modal:dragMove', $.proxy(function(e, placeX, placeY, modal) {
    this.elem.trigger('modalVideo:modal:dragMove', [placeX, placeY, modal, this]);
  }, this));
  this.elem.on('modal:dragStop', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:dragStop', [modal, this]);
  }, this));
  this.elem.on('modal:loadBodyStart', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:loadBodyStart', [modal, this]);
  }, this));
  this.elem.on('modal:loadBodySuccess', $.proxy(function(e, data, modal) {
    this.elem.trigger('modalVideo:modal:loadBodySuccess', [data, modal, this]);
  }, this));
  this.elem.on('modal:loadBodyError', $.proxy(function(e, xhr, modal) {
    this.elem.trigger('modalVideo:modal:loadBodyError', [xhr, modal, this]);
  }, this));
  this.elem.on('modal:dismiss', $.proxy(function(e, modal) {
    this.elem.trigger('modalVideo:modal:dismiss', [modal, this]);
  }, this));
}

RomoModalVideo.prototype._bindVideo = function() {
  this.video = undefined;

  var videoElem = this.modal.popupElem.find('[data-romo-video-auto="modalVideo"]');

  this._bindVideoElemEvents(videoElem);
  this._bindModalVideoTriggerEvents();

  this.video = videoElem.romoVideo()[0];
}

RomoModalVideo.prototype._bindVideoElemEvents = function(videoElem) {
  // playback events

  videoElem.on('video:play', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:play', [videoObj, video, this]);
  }, this));
  videoElem.on('video:pause', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:pause', [videoObj, video, this]);
  }, this));

  // state events

  videoElem.on('video:playing', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:playing', [videoObj, video, this]);
  }, this));
  videoElem.on('video:waiting', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:waiting', [videoObj, video, this]);
  }, this));
  videoElem.on('video:ended',  $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:ended', [videoObj, video, this]);
  }, this));
  videoElem.on('video:emptied', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:emptied', [videoObj, video, this]);
  }, this));
  videoElem.on('video:error', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:error', [videoObj, video, this]);
  }, this));
  videoElem.on('video:stalled', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:stalled', [videoObj, video, this]);
  }, this));
  videoElem.on('video:suspend', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:suspend', [videoObj, video, this]);
  }, this));

  // status events

  videoElem.on('video:progress', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:progress', [videoObj, video, this]);
  }, this));
  videoElem.on('video:timeupdate', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:timeupdate', [videoObj, video, this]);
  }, this));

  // settings events

  videoElem.on('video:volumechange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:volumechange', [videoObj, video, this]);
  }, this));
  videoElem.on('video:durationchange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:durationchange', [videoObj, video, this]);
  }, this));
  videoElem.on('video:ratechange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:ratechange', [videoObj, video, this]);
  }, this));

  // fullscreen events

  videoElem.on('video:enterFullscreen', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:enterFullscreen', [videoObj, video, this]);
  }, this));
  videoElem.on('video:exitFullscreen', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:exitFullscreen', [videoObj, video, this]);
  }, this));
  videoElem.on('video:fullscreenChange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:fullscreenChange', [videoObj, video, this]);
  }, this));

  // load events

  videoElem.on('video:loadstart', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:loadstart', [videoObj, video, this]);
  }, this));
  videoElem.on('video:loadedmetadata', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:loadedmetadata', [videoObj, video, this]);
  }, this));
  videoElem.on('video:loadeddata', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:loadeddata', [videoObj, video, this]);
  }, this));
  videoElem.on('video:canplay', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:canplay', [videoObj, video, this]);
  }, this));
  videoElem.on('video:canplaythrough', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('modalVideo:video:canplaythrough', [videoObj, video, this]);
  }, this));
}

RomoModalVideo.prototype._bindModalVideoTriggerEvents = function() {
  // playback triggers

  this.elem.on('modalVideo:video:triggerPlay', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerPlay', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerPause', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerPause', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerTogglePlay', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerTogglePlay', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerSetPlaybackToTime', $.proxy(function(e, secondNum) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackToTime', [secondNum]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerSetPlaybackToFrame', $.proxy(function(e, frameNum) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackToFrame', [frameNum]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerSetPlaybackToPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackToPercent', [percent]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerModPlaybackByTime', $.proxy(function(e, secondsCount) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackByTime', [secondsCount]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerModPlaybackByFrames', $.proxy(function(e, frameCount) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackByFrames', [frameCount]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerModPlaybackByPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackByPercent', [percent]);
    }
  }, this));

  // settings triggers

  this.elem.on('modalVideo:video:triggerMute', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerMute', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerUnmute', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerUnmute', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerToggleMute', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerToggleMute', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerSetVolumeToPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetVolumeToPercent', [percent]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerModVolumeByPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModVolumeByPercent', [percent]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerSetPlaybackRate', $.proxy(function(e, rate) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackRate', [rate]);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerModPlaybackRate', $.proxy(function(e, rate) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackRate', [rate]);
    }
  }, this));

  // fullscreen triggers

  this.elem.on('modalVideo:video:triggerEnterFullscreen', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerEnterFullscreen', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerExitFullscreen', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerExitFullscreen', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerToggleFullscreen', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerToggleFullscreen', []);
    }
  }, this));

  // load triggers

  this.elem.on('modalVideo:video:triggerLoad', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerLoad', []);
    }
  }, this));
  this.elem.on('modalVideo:video:triggerModSource', $.proxy(function(e, source) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModSource', [source]);
    }
  }, this));
}

Romo.onInitUI(function(e) {
  Romo.initUIElems(e, '[data-romo-modalVideo-auto="true"]').romoModalVideo();
});
