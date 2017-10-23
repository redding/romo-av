$.fn.romoDropdownVideo = function() {
  return $.map(this, function(element) {
    return new RomoDropdownVideo(element);
  });
}

var RomoDropdownVideo = function(element) {
  this.elem = $(element);

  this.doInit();
  this._bindElem();

  this.elem.trigger('dropdownVideo:ready', [this]);
}

RomoDropdownVideo.prototype.doInit = function() {
  // override as needed
}

// private

RomoDropdownVideo.prototype._bindElem = function() {
  this._bindDropdown();
  this._bindVideo();

  this.elem.on('dropdown:loadBodySuccess', $.proxy(function(e, data, dropdown) {
    this._bindVideo();
  }, this));
}

RomoDropdownVideo.prototype._bindDropdown = function() {
  this.dropdown = this.elem.romoDropdown()[0];

  if (this.elem.data('romo-dropdown-clear-content') === undefined) {
    this.elem.attr('data-romo-dropdown-clear-content', 'true');
  }

  // dropdown/video interactions

  this.elem.on('dropdownVideo:video:loadedmetadata', $.proxy(function(e, videoObj, video, dropdownVideo) {
    this.dropdown.doPlacePopupElem();
  }, this));

  this.elem.on('dropdownVideo:video:enterFullscreen', $.proxy(function(e, videoObj, video, dropdownVideo) {
    // wait 1 sec then turn off dropdown body elem events - since we are in fullscreen
    // mode, we don't care about them
    setTimeout($.proxy(function() {
      this.dropdown.doUnBindWindowBodyClick();
      this.dropdown.doUnBindWindowBodyKeyUp();
      this.dropdown.doUnBindElemKeyUp();
    }, this), 1000);
  }, this));
  this.elem.on('dropdownVideo:video:exitFullscreen', $.proxy(function(e, videoObj, video, dropdownVideo) {
    // wait 1 sec then turn on dropdown body elem events - since we are no longer
    // in fullscreen mode, we need to care about them again
    setTimeout($.proxy(function() {
      this.dropdown.doBindWindowBodyClick();
      this.dropdown.doBindWindowBodyKeyUp();
      this.dropdown.doBindElemKeyUp();
    }, this), 1000);
  }, this));

  // event proxies

  this.elem.on('dropdown:ready', $.proxy(function(e, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:ready', [dropdown, this]);
  }, this));
  this.elem.on('dropdown:toggle', $.proxy(function(e, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:toggle', [dropdown, this]);
  }, this));
  this.elem.on('dropdown:popupOpen', $.proxy(function(e, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:popupOpen', [dropdown, this]);
  }, this));
  this.elem.on('dropdown:popupClose', $.proxy(function(e, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:popupClose', [dropdown, this]);
  }, this));
  this.elem.on('dropdown:loadBodyStart', $.proxy(function(e, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:loadBodyStart', [dropdown, this]);
  }, this));
  this.elem.on('dropdown:loadBodySuccess', $.proxy(function(e, data, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:loadBodySuccess', [data, dropdown, this]);
  }, this));
  this.elem.on('dropdown:loadBodyError', $.proxy(function(e, xhr, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:loadBodyError', [xhr, dropdown, this]);
  }, this));
  this.elem.on('dropdown:dismiss', $.proxy(function(e, dropdown) {
    this.elem.trigger('dropdownVideo:dropdown:dismiss', [dropdown, this]);
  }, this));
}

RomoDropdownVideo.prototype._bindVideo = function() {
  this.video = undefined;

  var videoElem = this.dropdown.popupElem.find('[data-romo-video-auto="dropdownVideo"]');

  this._bindVideoElemEvents(videoElem);
  this._bindDropdownVideoTriggerEvents();

  this.video = videoElem.romoVideo()[0];
}

RomoDropdownVideo.prototype._bindVideoElemEvents = function(videoElem) {
  // playback events

  videoElem.on('video:play', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:play', [videoObj, video, this]);
  }, this));
  videoElem.on('video:pause', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:pause', [videoObj, video, this]);
  }, this));

  // state events

  videoElem.on('video:playing', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:playing', [videoObj, video, this]);
  }, this));
  videoElem.on('video:waiting', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:waiting', [videoObj, video, this]);
  }, this));
  videoElem.on('video:ended',  $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:ended', [videoObj, video, this]);
  }, this));
  videoElem.on('video:emptied', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:emptied', [videoObj, video, this]);
  }, this));
  videoElem.on('video:error', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:error', [videoObj, video, this]);
  }, this));
  videoElem.on('video:stalled', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:stalled', [videoObj, video, this]);
  }, this));
  videoElem.on('video:suspend', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:suspend', [videoObj, video, this]);
  }, this));

  // status events

  videoElem.on('video:progress', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:progress', [videoObj, video, this]);
  }, this));
  videoElem.on('video:timeupdate', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:timeupdate', [videoObj, video, this]);
  }, this));

  // settings events

  videoElem.on('video:volumechange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:volumechange', [videoObj, video, this]);
  }, this));
  videoElem.on('video:durationchange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:durationchange', [videoObj, video, this]);
  }, this));
  videoElem.on('video:ratechange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:ratechange', [videoObj, video, this]);
  }, this));

  // fullscreen events

  videoElem.on('video:enterFullscreen', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:enterFullscreen', [videoObj, video, this]);
  }, this));
  videoElem.on('video:exitFullscreen', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:exitFullscreen', [videoObj, video, this]);
  }, this));
  videoElem.on('video:fullscreenChange', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:fullscreenChange', [videoObj, video, this]);
  }, this));

  // load events

  videoElem.on('video:loadstart', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:loadstart', [videoObj, video, this]);
  }, this));
  videoElem.on('video:loadedmetadata', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:loadedmetadata', [videoObj, video, this]);
  }, this));
  videoElem.on('video:loadeddata', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:loadeddata', [videoObj, video, this]);
  }, this));
  videoElem.on('video:canplay', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:canplay', [videoObj, video, this]);
  }, this));
  videoElem.on('video:canplaythrough', $.proxy(function(e, videoObj, video) {
    this.elem.trigger('dropdownVideo:video:canplaythrough', [videoObj, video, this]);
  }, this));
}

RomoDropdownVideo.prototype._bindDropdownVideoTriggerEvents = function() {
  // playback triggers

  this.elem.on('dropdownVideo:video:triggerPlay', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerPlay', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerPause', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerPause', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerTogglePlay', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerTogglePlay', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerSetPlaybackToTime', $.proxy(function(e, secondNum) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackToTime', [secondNum]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerSetPlaybackToFrame', $.proxy(function(e, frameNum) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackToFrame', [frameNum]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerSetPlaybackToPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackToPercent', [percent]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerModPlaybackByTime', $.proxy(function(e, secondsCount) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackByTime', [secondsCount]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerModPlaybackByFrames', $.proxy(function(e, frameCount) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackByFrames', [frameCount]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerModPlaybackByPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackByPercent', [percent]);
    }
  }, this));

  // settings triggers

  this.elem.on('dropdownVideo:video:triggerMute', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerMute', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerUnmute', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerUnmute', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerToggleMute', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerToggleMute', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerSetVolumeToPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetVolumeToPercent', [percent]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerModVolumeByPercent', $.proxy(function(e, percent) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModVolumeByPercent', [percent]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerSetPlaybackRate', $.proxy(function(e, rate) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerSetPlaybackRate', [rate]);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerModPlaybackRate', $.proxy(function(e, rate) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModPlaybackRate', [rate]);
    }
  }, this));

  // fullscreen triggers

  this.elem.on('dropdownVideo:video:triggerEnterFullscreen', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerEnterFullscreen', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerExitFullscreen', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerExitFullscreen', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerToggleFullscreen', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerToggleFullscreen', []);
    }
  }, this));

  // load triggers

  this.elem.on('dropdownVideo:video:triggerLoad', $.proxy(function(e) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerLoad', []);
    }
  }, this));
  this.elem.on('dropdownVideo:video:triggerModSource', $.proxy(function(e, source) {
    if (this.video != undefined) {
      this.video.elem.trigger('video:triggerModSource', [source]);
    }
  }, this));
}

Romo.onInitUI(function(e) {
  Romo.initUIElems(e, '[data-romo-dropdownVideo-auto="true"]').romoDropdownVideo();
});
