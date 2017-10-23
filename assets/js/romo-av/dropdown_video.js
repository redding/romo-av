$.fn.romoDropdownVideo = function() {
  return $.map(this, function(element) {
    return new RomoDropdownVideo(element);
  });
}

var RomoDropdownVideo = function(element) {
  this.elem = $(element);

  this.doInit();
  this._bindElem();

  this.elem.trigger('romoDropdownVideo:ready', [this]);
}

RomoDropdownVideo.prototype.doInit = function() {
  // override as needed
}

// private

RomoDropdownVideo.prototype._bindElem = function() {
  this._bindDropdown();
  this._bindVideo();

  this.elem.on('romoDropdown:loadBodySuccess', $.proxy(function(e, data, romoDropdown) {
    this._bindVideo();
  }, this));
}

RomoDropdownVideo.prototype._bindDropdown = function() {
  this.romoDropdown = this.elem.romoDropdown()[0];

  if (this.elem.data('romo-dropdown-clear-content') === undefined) {
    this.elem.attr('data-romo-dropdown-clear-content', 'true');
  }

  // dropdown/video interactions

  this.elem.on('romoDropdownVideo:romoVideo:loadedmetadata', $.proxy(function(e, videoObj, romoVideo, romoDropdownVideo) {
    this.romoDropdown.doPlacePopupElem();
  }, this));

  this.elem.on('romoDropdownVideo:romoVideo:enterFullscreen', $.proxy(function(e, videoObj, romoVideo, romoDropdownVideo) {
    // wait 1 sec then turn off dropdown body elem events - since we are in fullscreen
    // mode, we don't care about them
    setTimeout($.proxy(function() {
      this.romoDropdown.doUnBindWindowBodyClick();
      this.romoDropdown.doUnBindWindowBodyKeyUp();
      this.romoDropdown.doUnBindElemKeyUp();
    }, this), 1000);
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:exitFullscreen', $.proxy(function(e, videoObj, romoVideo, romoDropdownVideo) {
    // wait 1 sec then turn on dropdown body elem events - since we are no longer
    // in fullscreen mode, we need to care about them again
    setTimeout($.proxy(function() {
      this.romoDropdown.doBindWindowBodyClick();
      this.romoDropdown.doBindWindowBodyKeyUp();
      this.romoDropdown.doBindElemKeyUp();
    }, this), 1000);
  }, this));

  // event proxies

  this.elem.on('romoDropdown:ready', $.proxy(function(e, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:ready', [romoDropdown, this]);
  }, this));
  this.elem.on('romoDropdown:toggle', $.proxy(function(e, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:toggle', [romoDropdown, this]);
  }, this));
  this.elem.on('romoDropdown:popupOpen', $.proxy(function(e, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:popupOpen', [romoDropdown, this]);
  }, this));
  this.elem.on('romoDropdown:popupClose', $.proxy(function(e, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:popupClose', [romoDropdown, this]);
  }, this));
  this.elem.on('romoDropdown:loadBodyStart', $.proxy(function(e, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:loadBodyStart', [romoDropdown, this]);
  }, this));
  this.elem.on('romoDropdown:loadBodySuccess', $.proxy(function(e, data, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:loadBodySuccess', [data, romoDropdown, this]);
  }, this));
  this.elem.on('romoDropdown:loadBodyError', $.proxy(function(e, xhr, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:loadBodyError', [xhr, romoDropdown, this]);
  }, this));
  this.elem.on('romoDropdown:dismiss', $.proxy(function(e, romoDropdown) {
    this.elem.trigger('romoDropdownVideo:romoDropdown:dismiss', [romoDropdown, this]);
  }, this));
}

RomoDropdownVideo.prototype._bindVideo = function() {
  this.romoVideo = undefined;

  var videoElem = this.romoDropdown.popupElem.find('[data-romo-video-auto="dropdownVideo"]');

  this._bindVideoElemEvents(videoElem);
  this._bindDropdownVideoTriggerEvents();

  this.romoVideo = videoElem.romoVideo()[0];
}

RomoDropdownVideo.prototype._bindVideoElemEvents = function(videoElem) {
  // playback events

  videoElem.on('romoVideo:play', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:play', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:pause', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:pause', [videoObj, romoVideo, this]);
  }, this));

  // state events

  videoElem.on('romoVideo:playing', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:playing', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:waiting', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:waiting', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:ended',  $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:ended', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:emptied', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:emptied', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:error', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:error', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:stalled', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:stalled', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:suspend', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:suspend', [videoObj, romoVideo, this]);
  }, this));

  // status events

  videoElem.on('romoVideo:progress', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:progress', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:timeupdate', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:timeupdate', [videoObj, romoVideo, this]);
  }, this));

  // settings events

  videoElem.on('romoVideo:volumechange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:volumechange', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:durationchange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:durationchange', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:ratechange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:ratechange', [videoObj, romoVideo, this]);
  }, this));

  // fullscreen events

  videoElem.on('romoVideo:enterFullscreen', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:enterFullscreen', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:exitFullscreen', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:exitFullscreen', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:fullscreenChange', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:fullscreenChange', [videoObj, romoVideo, this]);
  }, this));

  // load events

  videoElem.on('romoVideo:loadstart', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:loadstart', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:loadedmetadata', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:loadedmetadata', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:loadeddata', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:loadeddata', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:canplay', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:canplay', [videoObj, romoVideo, this]);
  }, this));
  videoElem.on('romoVideo:canplaythrough', $.proxy(function(e, videoObj, romoVideo) {
    this.elem.trigger('romoDropdownVideo:romoVideo:canplaythrough', [videoObj, romoVideo, this]);
  }, this));
}

RomoDropdownVideo.prototype._bindDropdownVideoTriggerEvents = function() {
  // playback triggers

  this.elem.on('romoDropdownVideo:romoVideo:triggerPlay', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerPlay', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerPause', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerPause', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerTogglePlay', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerTogglePlay', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerSetPlaybackToTime', $.proxy(function(e, secondNum) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackToTime', [secondNum]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerSetPlaybackToFrame', $.proxy(function(e, frameNum) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackToFrame', [frameNum]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerSetPlaybackToPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackToPercent', [percent]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerModPlaybackByTime', $.proxy(function(e, secondsCount) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackByTime', [secondsCount]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerModPlaybackByFrames', $.proxy(function(e, frameCount) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackByFrames', [frameCount]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerModPlaybackByPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackByPercent', [percent]);
    }
  }, this));

  // settings triggers

  this.elem.on('romoDropdownVideo:romoVideo:triggerMute', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerMute', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerUnmute', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerUnmute', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerToggleMute', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerToggleMute', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerSetVolumeToPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetVolumeToPercent', [percent]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerModVolumeByPercent', $.proxy(function(e, percent) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModVolumeByPercent', [percent]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerSetPlaybackRate', $.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerSetPlaybackRate', [rate]);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerModPlaybackRate', $.proxy(function(e, rate) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModPlaybackRate', [rate]);
    }
  }, this));

  // fullscreen triggers

  this.elem.on('romoDropdownVideo:romoVideo:triggerEnterFullscreen', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerEnterFullscreen', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerExitFullscreen', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerExitFullscreen', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerToggleFullscreen', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerToggleFullscreen', []);
    }
  }, this));

  // load triggers

  this.elem.on('romoDropdownVideo:romoVideo:triggerLoad', $.proxy(function(e) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerLoad', []);
    }
  }, this));
  this.elem.on('romoDropdownVideo:romoVideo:triggerModSource', $.proxy(function(e, source) {
    if (this.romoVideo != undefined) {
      this.romoVideo.elem.trigger('romoVideo:triggerModSource', [source]);
    }
  }, this));
}

Romo.onInitUI(function(e) {
  Romo.initUIElems(e, '[data-romo-dropdownVideo-auto="true"]').romoDropdownVideo();
});
