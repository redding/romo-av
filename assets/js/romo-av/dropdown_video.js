var RomoDropdownVideo = RomoComponent(function(elem) {
  this.elem = elem;

  this.doInit();
  this._bindElem();

  Romo.trigger(this.elem, 'romoDropdownVideo:ready', [this]);
});

// private

RomoDropdownVideo.prototype._bindElem = function() {
  this._bindDropdown();
  this._bindVideo();

  Romo.on(this.elem, 'romoDropdown:loadBodySuccess', Romo.proxy(function(e, data, romoDropdown) {
    this._bindVideo();
  }, this));
}

RomoDropdownVideo.prototype._bindDropdown = function() {
  if (Romo.data(this.elem, 'romo-dropdown-clear-content') === undefined) {
    Romo.setData(this.elem, 'romo-dropdown-clear-content', 'true');
  }

  this.romoDropdown = new RomoDropdown(this.elem);

  // dropdown/video interactions

  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:loadedmetadata', Romo.proxy(function(e, videoObj, romoVideo, romoDropdownVideo) {
    this.romoDropdown.doPlacePopupElem();
  }, this));

  // event proxies

  Romo.on(this.elem, 'romoDropdown:ready', Romo.proxy(function(e, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:ready', [romoDropdown, this]);
  }, this));
  Romo.on(this.elem, 'romoDropdown:toggle', Romo.proxy(function(e, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:toggle', [romoDropdown, this]);
  }, this));
  Romo.on(this.elem, 'romoDropdown:popupOpen', Romo.proxy(function(e, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:popupOpen', [romoDropdown, this]);
  }, this));
  Romo.on(this.elem, 'romoDropdown:popupClose', Romo.proxy(function(e, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:popupClose', [romoDropdown, this]);
  }, this));
  Romo.on(this.elem, 'romoDropdown:loadBodyStart', Romo.proxy(function(e, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:loadBodyStart', [romoDropdown, this]);
  }, this));
  Romo.on(this.elem, 'romoDropdown:loadBodySuccess', Romo.proxy(function(e, data, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:loadBodySuccess', [data, romoDropdown, this]);
  }, this));
  Romo.on(this.elem, 'romoDropdown:loadBodyError', Romo.proxy(function(e, xhr, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:loadBodyError', [xhr, romoDropdown, this]);
  }, this));
  Romo.on(this.elem, 'romoDropdown:dismiss', Romo.proxy(function(e, romoDropdown) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoDropdown:dismiss', [romoDropdown, this]);
  }, this));
}

RomoDropdownVideo.prototype._bindVideo = function() {
  this.romoVideo = undefined;

  var videoElem = Romo.find(this.romoDropdown.popupElem, '[data-romo-video-auto="dropdownVideo"]')[0];
  if (videoElem !== undefined) {
    this._bindVideoElemEvents(videoElem);
    this._bindDropdownVideoTriggerEvents();

    this.romoVideo = new RomoVideo(videoElem);
  }
}

RomoDropdownVideo.prototype._bindVideoElemEvents = function(videoElem) {
  // playback events

  Romo.on(videoElem, 'romoVideo:play', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:play', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:pause', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:pause', [videoObj, romoVideo, this]);
  }, this));

  // state events

  Romo.on(videoElem, 'romoVideo:playing', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:playing', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:waiting', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:waiting', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:ended', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:ended', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:emptied', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:emptied', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:error', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:error', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:stalled', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:stalled', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:suspend', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:suspend', [videoObj, romoVideo, this]);
  }, this));

  // status events

  Romo.on(videoElem, 'romoVideo:progress', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:progress', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:timeupdate', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:timeupdate', [videoObj, romoVideo, this]);
  }, this));

  // settings events

  Romo.on(videoElem, 'romoVideo:volumechange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:volumechange', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:durationchange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:durationchange', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:ratechange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:ratechange', [videoObj, romoVideo, this]);
  }, this));

  // fullscreen events

  Romo.on(videoElem, 'romoVideo:enterFullscreen', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:enterFullscreen', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:exitFullscreen', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:exitFullscreen', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:fullscreenChange', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:fullscreenChange', [videoObj, romoVideo, this]);
  }, this));

  // load events

  Romo.on(videoElem, 'romoVideo:loadstart', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:loadstart', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:loadedmetadata', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:loadedmetadata', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:loadeddata', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:loadeddata', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:canplay', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:canplay', [videoObj, romoVideo, this]);
  }, this));
  Romo.on(videoElem, 'romoVideo:canplaythrough', Romo.proxy(function(e, videoObj, romoVideo) {
    Romo.trigger(this.elem, 'romoDropdownVideo:romoVideo:canplaythrough', [videoObj, romoVideo, this]);
  }, this));
}

RomoDropdownVideo.prototype._bindDropdownVideoTriggerEvents = function() {
  // playback triggers

  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerPlay', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerPlay', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerPause', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerPause', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerTogglePlay', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerTogglePlay', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerSetPlaybackToTime', Romo.proxy(function(e, secondNum) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackToTime', [secondNum]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerSetPlaybackToFrame', Romo.proxy(function(e, frameNum) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackToFrame', [frameNum]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerSetPlaybackToPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackToPercent', [percent]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerModPlaybackByTime', Romo.proxy(function(e, secondsCount) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackByTime', [secondsCount]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerModPlaybackByFrames', Romo.proxy(function(e, frameCount) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackByFrames', [frameCount]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerModPlaybackByPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackByPercent', [percent]);
    }
  }, this));

  // settings triggers

  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerMute', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerMute', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerUnmute', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerUnmute', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerToggleMute', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerToggleMute', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerSetVolumeToPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetVolumeToPercent', [percent]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerModVolumeByPercent', Romo.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModVolumeByPercent', [percent]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerSetPlaybackRate', Romo.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerSetPlaybackRate', [rate]);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerModPlaybackRate', Romo.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModPlaybackRate', [rate]);
    }
  }, this));

  // fullscreen triggers

  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerEnterFullscreen', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerEnterFullscreen', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerExitFullscreen', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerExitFullscreen', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerToggleFullscreen', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerToggleFullscreen', []);
    }
  }, this));

  // load triggers

  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerLoad', Romo.proxy(function(e) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerLoad', []);
    }
  }, this));
  Romo.on(this.elem, 'romoDropdownVideo:romoVideo:triggerModSource', Romo.proxy(function(e, source) {
    if (this.romoVideo != undefined) {
      Romo.trigger(this.romoVideo.elem, 'romoVideo:triggerModSource', [source]);
    }
  }, this));
}

// init

Romo.addElemsInitSelector('[data-romo-dropdownVideo-auto="true"]', RomoDropdownVideo);
