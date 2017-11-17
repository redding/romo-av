var RomoModalVideo = RomoComponent(function(elem) {
  this.elem = elem;

  this.doInit();
  this._bindElem();

  Romo.trigger(this.elem, 'romoModalVideo:ready', [this]);
});

// private

RomoModalVideo.prototype._bindElem = function() {
  this._bindModal();
  this._bindVideo();

  Romo.on(this.elem, 'romoModal:loadBodySuccess', Romo.proxy(function(e, data, romoModal) {
    this._bindVideo();
  }, this));
}

RomoModalVideo.prototype._bindModal = function() {
  if (Romo.data(this.elem, 'romo-modal-clear-content') === undefined) {
    Romo.setData(this.elem, 'romo-modal-clear-content', 'true');
  }

  this.romoModal = new RomoModal(this.elem);

  // modal/video interactions

  Romo.on(this.elem, 'romoModalVideo:romoVideo:loadedmetadata', Romo.proxy(function(e, videoObj, romoVideo, romoModalVideo) {
    this.romoModal.doPlacePopupElem();
  }, this));

  // event proxies

  Romo.on(this.elem, 'romoModal:ready', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:ready', [romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:toggle', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:toggle', [romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:popupOpen', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:popupOpen', [romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:popupClose', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:popupClose', [romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:dragStart', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:dragStart', [romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:dragMove', Romo.proxy(function(e, placeX, placeY, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:dragMove', [placeX, placeY, romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:dragStop', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:dragStop', [romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:loadBodyStart', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:loadBodyStart', [romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:loadBodySuccess', Romo.proxy(function(e, data, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:loadBodySuccess', [data, romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:loadBodyError', Romo.proxy(function(e, xhr, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:loadBodyError', [xhr, romoModal, this]);
  }, this));
  Romo.on(this.elem, 'romoModal:dismiss', Romo.proxy(function(e, romoModal) {
    Romo.trigger(this.elem, 'romoModalVideo:romoModal:dismiss', [romoModal, this]);
  }, this));
}

RomoModalVideo.prototype._bindVideo = function() {
  this.romoVideo = undefined;

  var videoElem = Romo.find(this.romoModal.popupElem, '[data-romo-video-auto="modalVideo"]')[0];
  if (videoElem !== undefined) {
    this._bindVideoElemEvents(videoElem);
    this._bindModalVideoTriggerEvents();

    this.romoVideo = new RomoVideo(videoElem);
  }
}

RomoModalVideo.prototype._bindVideoElemEvents = function(videoElem) {
  // playback events

  Romo.on(videoElem, 'romoVideo:play', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:play', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:pause', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:pause', [videoObj, romoVideo, this]);
  }, this));

  // state events

  Romo.on(videoElem, 'romoVideo:playing', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:playing', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:waiting', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:waiting', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:ended', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:ended', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:emptied', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:emptied', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:error', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:error', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:stalled', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:stalled', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:suspend', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:suspend', [videoObj, romoVideo, this]);
  }, this));

  // status events

  Romo.on(videoElem, 'romoVideo:progress', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:progress', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:timeupdate', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:timeupdate', [videoObj, romoVideo, this]);
  }, this));

  // settings events

  Romo.on(videoElem, 'romoVideo:volumechange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:volumechange', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:durationchange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:durationchange', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:ratechange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:ratechange', [videoObj, romoVideo, this]);
  }, this));

  // fullscreen events

  Romo.on(videoElem, 'romoVideo:enterFullscreen', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:enterFullscreen', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:exitFullscreen', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:exitFullscreen', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:fullscreenChange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:fullscreenChange', [videoObj, romoVideo, this]);
  }, this));

  // load events

  Romo.on(videoElem, 'romoVideo:loadstart', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:loadstart', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:loadedmetadata', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:loadedmetadata', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:loadeddata', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:loadeddata', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:canplay', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:canplay', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:canplaythrough', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoModalVideo:romoVideo:canplaythrough', [videoObj, romoVideo, this]);
  }, this));
}

RomoModalVideo.prototype._bindModalVideoTriggerEvents = function() {
  // playback triggers

  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerPlay', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerPlay', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerPause', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerPause', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerTogglePlay', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerTogglePlay', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerSetPlaybackToTime', Romo.proxy(function(e, secondNum) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackToTime', [secondNum]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerSetPlaybackToFrame', Romo.proxy(function(e, frameNum) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackToFrame', [frameNum]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerSetPlaybackToPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackToPercent', [percent]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerModPlaybackByTime', Romo.proxy(function(e, secondsCount) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackByTime', [secondsCount]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerModPlaybackByFrames', Romo.proxy(function(e, frameCount) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackByFrames', [frameCount]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerModPlaybackByPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackByPercent', [percent]);
    }
  }, this));

  // settings triggers

  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerMute', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerMute', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerUnmute', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerUnmute', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerToggleMute', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerToggleMute', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerSetVolumeToPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetVolumeToPercent', [percent]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerModVolumeByPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModVolumeByPercent', [percent]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerSetPlaybackRate', Romo.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackRate', [rate]);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerModPlaybackRate', Romo.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackRate', [rate]);
    }
  }, this));

  // fullscreen triggers

  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerEnterFullscreen', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerEnterFullscreen', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerExitFullscreen', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerExitFullscreen', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerToggleFullscreen', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerToggleFullscreen', []);
    }
  }, this));

  // load triggers

  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerLoad', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerLoad', []);
    }
  }, this));
  Romo.on(this.elem, 'romoModalVideo:romoVideo:triggerModSource', Romo.proxy(function(e, source) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModSource', [source]);
    }
  }, this));
}

// init

Romo.addElemsInitSelector('[data-romo-modalVideo-auto="true"]', RomoModalVideo);
