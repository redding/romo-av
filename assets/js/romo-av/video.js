$.fn.romoVideo = function() {
  return $.map(this, function(element) {
    return new RomoVideo(element);
  });
}

var RomoVideo = function(element) {
  this.elem     = $(element);
  this.videoObj = this.elem[0];

  this._bindFullscreen();
  this._bindVideo();

  this.doInit();
  this._loadState();

  this.durationTime   = undefined;
  this.durationFrames = undefined;
  this.elem.on('loadedmetadata', $.proxy(function(e) {
    this.durationTime   = this.getDurationTime();
    this.durationFrames = this.getDurationFrames();
  }, this));

  this.elem.trigger('video:ready', [this.video, this]);
}

RomoVideo.prototype.doInit = function() {
  // override as needed
}

// Playback methods

RomoVideo.prototype.doPlay = function() {
  this.videoObj.play();
}

RomoVideo.prototype.doPause = function() {
  this.videoObj.pause();
}

RomoVideo.prototype.doTogglePlay = function() {
  if (this.videoObj.paused) {
    this.videoObj.play();
  } else {
    this.videoObj.pause();
  }
}

RomoVideo.prototype.doSetPlaybackToTime = function(secondNum) {
  this._setPlayback(secondNum);
}

RomoVideo.prototype.doSetPlaybackToFrame = function(frameNum) {
  if(this.fpsEnabled !== true){ return; }
  this._setPlayback(this._frameNumToSecondNum(frameNum));
}

RomoVideo.prototype.doSetPlaybackToPercent = function(percent) {
  this._setPlayback(this._percentToSecondNum(percent));
}

RomoVideo.prototype.doModPlaybackByTime = function(secondsCount) {
  this._setPlayback(this.videoObj.currentTime + secondsCount);
}

RomoVideo.prototype.doModPlaybackByFrames = function(frameCount) {
  if(this.fpsEnabled !== true){ return; }
  this._setPlayback(this.videoObj.currentTime + this._frameNumToSecondNum(frameCount));
}

RomoVideo.prototype.doModPlaybackByPercent = function(percent) {
  this._setPlayback(this.videoObj.currentTime + this._percentToSecondNum(percent));
}

// Settings methods

RomoVideo.prototype.doMute = function() {
  this.videoObj.muted = true;
  this.elem.trigger('video:volumechange', [this.videoObj, this]);
}

RomoVideo.prototype.doUnmute = function() {
  this.videoObj.muted = false;
  this.elem.trigger('video:volumechange', [this.videoObj, this]);
}

RomoVideo.prototype.doToggleMute = function() {
  this.videoObj.muted = !this.videoObj.muted;
  this.elem.trigger('video:volumechange', [this.videoObj, this]);
}

RomoVideo.prototype.getLoop = function() {
  return this.elem.prop('loop');
}

RomoVideo.prototype.doLoop = function() {
  this.elem.prop('loop', true);
  this.elem.trigger('video:loop',       [this.videoObj, this]);
  this.elem.trigger('video:loopChange', [true, this.videoObj, this]);
}

RomoVideo.prototype.doNoLoop = function() {
  this.elem.prop('loop', false);
  this.elem.trigger('video:noloop',     [this.videoObj, this]);
  this.elem.trigger('video:loopChange', [false, this.videoObj, this]);
}

RomoVideo.prototype.doToggleLoop = function() {
  if (this.getLoop() !== true) {
    this.doLoop();
  } else {
    this.doNoLoop();
  }
}

RomoVideo.prototype.doSetVolumeToPercent = function(percent) {
  this._setVolume(percent / 100);
}

RomoVideo.prototype.doModVolumeByPercent = function(percent) {
  this._setVolume(this.videoObj.volume + (percent / 100));
}

RomoVideo.prototype.doSetPlaybackToRate = function(rate) {
  this.videoObj.playbackRate = rate;
}

RomoVideo.prototype.doModPlaybackByRate = function(rate) {
  this.videoObj.playbackRate = this.videoObj.playbackRate + rate;
}

// Fullscreen methods

RomoVideo.prototype.doEnterFullscreen = function() {
  this._requestFullscreen();
}

RomoVideo.prototype.doExitFullscreen = function() {
  this._exitFullscreen();
}

RomoVideo.prototype.doToggleFullscreen = function() {
  if (this.fullScreen === true) {
    this._exitFullscreen();
  } else {
    this._requestFullscreen();
  }
}

// Status methods

RomoVideo.prototype.getPlaybackTime = function() {
  return this.videoObj.currentTime;
}

RomoVideo.prototype.getPlaybackFrame = function() {
  return this.getVideoTimeInFrames(this.getPlaybackTime());
}

RomoVideo.prototype.getPlaybackPercent = function() {
  return this.getVideoTimeInPercent(this.getPlaybackTime());
}

RomoVideo.prototype.getDurationTime = function() {
  if (this.durationTime !== undefined) {
    return this.durationTime;
  } else if (isNaN(parseInt(this.videoObj.duration)) === true) {
    return 0.0;
  } else {
    return this.videoObj.duration;
  }
}

RomoVideo.prototype.getDurationFrames = function() {
  if (this.durationFrames !== undefined) {
    return this.durationFrames;
  } else if (this.fpsEnabled !== true) {
    return 0;
  } else {
    return Math.round(this.getDurationTime() * this.fps);
  }
}

RomoVideo.prototype.getDurationPercent = function() {
  return 100;
}

RomoVideo.prototype.getTotalBufferedTime = function() {
  return this.getTotalBufferedTuples().reduce(function(prev, curr) {
    return prev + (curr[1] - curr[0]);
  }, 0.0);
}

RomoVideo.prototype.getTotalBufferedFrames = function() {
  return this.getVideoTimeInFrames(this.getTotalBufferedTime());
}

RomoVideo.prototype.getTotalBufferedPercent = function() {
  return this.getVideoTimeInPercent(this.getTotalBufferedTime());
}

RomoVideo.prototype.getTotalBufferedTuples = function() {
  var tuples   = [];
  var buffered = this.videoObj.buffered;
  for (i = 0; i < buffered.length; i++) {
    tuples.push([buffered.start(i), buffered.end(i)]);
  }
  return tuples;
}

RomoVideo.prototype.getVolumeValue = function() {
  if (this.videoObj.muted === true) {
    return 0;
  } else {
    return this.videoObj.volume;
  }
}

RomoVideo.prototype.getVolumePercent = function() {
  return this.getVolumeValue() * 100;
}

RomoVideo.prototype.getVolumeMuted = function() {
  return this.videoObj.muted === true || this.getVolumePercent() === 0;
}

// Load methods

RomoVideo.prototype.doLoad = function() {
  this.doPause();
  this._loadState();
  this.videoObj.load();
}

RomoVideo.prototype.doModSource = function(source) {
  this.videoObj.src = source;

  this.durationTime   = undefined;
  this.durationFrames = undefined;
}

// Helper methods

RomoVideo.prototype.getVideoTimeInFrames = function(time) {
  return this.getVideoPercentInFrames(this.getVideoTimeInPercent(time));
}
RomoVideo.prototype.getVideoTimeInPercent = function(time) {
  if (this.getDurationTime() === 0.0) {
    return 0;
  } else {
    return (time / this.getDurationTime()) * 100;
  }
}
RomoVideo.prototype.getVideoFramesInTime = function(frameCount) {
  return this.getVideoPercentInTime(this.getVideoFramesInPercent(frameCount));
}
RomoVideo.prototype.getVideoFramesInPercent = function(frameCount) {
  if (this.fpsEnabled !== true) {
    return 0;
  } else {
    return (frameCount / this.getDurationFrames()) * 100;
  }
}
RomoVideo.prototype.getVideoPercentInTime = function(percent) {
  return (percent / 100) * this.getDurationTime();
}
RomoVideo.prototype.getVideoPercentInFrames = function(percent) {
  if (this.fpsEnabled !== true) {
    return 0;
  } else {
    var framesCalc = (percent / 100) * this.getDurationFrames();
    if (framesCalc >= 0) {
      return Math.ceil(framesCalc);
    } else {
      return Math.floor(framesCalc);
    }
  }
}

RomoVideo.prototype.getVideoFormattedTime = function(seconds) {
  if (isNaN(parseInt(seconds)) === true){ return '00:00.000'; }
  else if (seconds === 0){ return '00:00.000'; }

  var abs  = Math.abs(seconds);
  var hrs  = Math.floor(abs / 3600);
  var mins = Math.floor((abs - (hrs * 3600)) / 60);
  var secs = Math.floor(abs % 60);
  var ms   = (abs - Math.floor(abs));

  var t = (hrs ? hrs + ':' : '') +
          (mins < 10 ? '0' : '') + mins + ':' +
          (secs < 10 ? '0' : '') + secs + ms.toFixed(3).slice(1);

  if (seconds > 0){ return t; }
  else{ return '-'+t; }
}

// private

RomoVideo.prototype._setPlayback = function(newSecondNum) {
  var durationTime = this.getDurationTime();
  if (newSecondNum > durationTime) {
    if (this.elem.prop('loop') === true){
      this.videoObj.currentTime = newSecondNum - durationTime;
    } else {
      this.videoObj.currentTime = durationTime;
    }
  } else if (newSecondNum < 0) {
    if (this.elem.prop('loop') === true){
      this.videoObj.currentTime = (durationTime - (0 - newSecondNum));
    } else {
      this.videoObj.currentTime = 0;
    }
  } else {
    this.videoObj.currentTime = newSecondNum;
  }
}

RomoVideo.prototype._frameNumToSecondNum = function(frameNum) {
  return frameNum / this.fps;
}

RomoVideo.prototype._percentToSecondNum = function(percent) {
  return (percent / 100) * this.getDurationTime();
}

RomoVideo.prototype._setVolume = function(value) {
  if (value > 1) {
    this.videoObj.volume = 1;
  } else if (value < 0) {
    this.videoObj.volume = 0;
  } else {
    this.videoObj.volume = value;
  }
  this.doUnmute();
}

RomoVideo.prototype._loadState = function() {
  this.fps = this.elem.data('romo-video-fps');
  if (this.fps && this.fps > 0) {
    this.fpsEnabled = true;
  } else {
    this.fpsEnabled = false;
  }
}

RomoVideo.prototype._bindFullscreen = function() {
  var fullscreenElem = this.elem.closest(this.elem.data('romo-video-fullscreen-elem'));
  if (fullscreenElem[0] !== undefined) {
    this.fullscreenElem = fullscreenElem;
  } else {
    this.fullscreenElem = this.elem;
  }

  this._browserRequestFullscreen = this._getBrowserRequestFullscreen(this.fullscreenElem);
  this._browserExitFullscreen    = this._getBrowserExitFullscreen();

  $(document).on('fullscreenchange',       $.proxy(this._onDocumentFullscreenChange, this));
  $(document).on('mozfullscreenchange',    $.proxy(this._onDocumentFullscreenChange, this));
  $(document).on('msfullscreenchange',     $.proxy(this._onDocumentFullscreenChange, this));
  $(document).on('webkitfullscreenchange', $.proxy(this._onDocumentFullscreenChange, this));
}

RomoVideo.prototype._bindVideo = function() {
  this._bindVideoElemEvents();
  this._bindVideoTriggerEvents();
}

RomoVideo.prototype._bindVideoElemEvents = function() {
  // playback events

  this.elem.on('play', $.proxy(function(e) {
    this.elem.trigger('video:play', [this.videoObj, this]);
  }, this));
  this.elem.on('pause', $.proxy(function(e) {
    this.elem.trigger('video:pause', [this.videoObj, this]);
  }, this));

  // state events

  this.elem.on('playing', $.proxy(function(e) {
    this.elem.trigger('video:playing', [this.videoObj, this]);
  }, this));
  this.elem.on('waiting', $.proxy(function(e) {
    this.elem.trigger('video:waiting', [this.videoObj, this]);
  }, this));
  this.elem.on('ended',  $.proxy(function(e) {
    this.elem.trigger('video:ended', [this.videoObj, this]);
  }, this));
  this.elem.on('emptied', $.proxy(function(e) {
    this.elem.trigger('video:emptied', [this.videoObj, this]);
  }, this));
  this.elem.on('error', $.proxy(function(e) {
    this.elem.trigger('video:error', [this.videoObj, this]);
  }, this));
  this.elem.on('stalled', $.proxy(function(e) {
    this.elem.trigger('video:stalled', [this.videoObj, this]);
  }, this));
  this.elem.on('suspend', $.proxy(function(e) {
    this.elem.trigger('video:suspend', [this.videoObj, this]);
  }, this));

  // status events

  this.elem.on('progress', $.proxy(function(e) {
    this.elem.trigger('video:progress', [this.videoObj, this]);
  }, this));
  this.elem.on('timeupdate', $.proxy(function(e) {
    this.elem.trigger('video:timeupdate', [this.videoObj, this]);
  }, this));

  // settings events

  this.elem.on('volumechange', $.proxy(function(e) {
    this.elem.trigger('video:volumechange', [this.videoObj, this]);
  }, this));
  this.elem.on('durationchange', $.proxy(function(e) {
    this.elem.trigger('video:durationchange', [this.videoObj, this]);
  }, this));
  this.elem.on('ratechange', $.proxy(function(e) {
    this.elem.trigger('video:ratechange', [this.videoObj, this]);
  }, this));

  // load events

  this.elem.on('loadstart', $.proxy(function(e) {
    this.elem.trigger('video:loadstart', [this.videoObj, this]);
  }, this));
  this.elem.on('loadedmetadata', $.proxy(function(e) {
    this.elem.trigger('video:loadedmetadata', [this.videoObj, this]);
  }, this));
  this.elem.on('loadeddata', $.proxy(function(e) {
    this.elem.trigger('video:loadeddata', [this.videoObj, this]);
  }, this));
  this.elem.on('canplay', $.proxy(function(e) {
    this.elem.trigger('video:canplay', [this.videoObj, this]);
  }, this));
  this.elem.on('canplaythrough', $.proxy(function(e) {
    this.elem.trigger('video:canplaythrough', [this.videoObj, this]);
  }, this));
}

RomoVideo.prototype._bindVideoTriggerEvents = function() {
  // playback triggers

  this.elem.on('video:triggerPlay', $.proxy(function(e) {
    this.doPlay(); return false;
  }, this));
  this.elem.on('video:triggerPause', $.proxy(function(e) {
    this.doPause(); return false;
  }, this));
  this.elem.on('video:triggerTogglePlay', $.proxy(function(e) {
    this.doTogglePlay(); return false;
  }, this));
  this.elem.on('video:triggerSetPlaybackToTime', $.proxy(function(e, secondNum) {
    this.doSetPlaybackToTime(secondNum); return false;
  }, this));
  this.elem.on('video:triggerSetPlaybackToFrame', $.proxy(function(e, frameNum) {
    this.doSetPlaybackToFrame(frameNum); return false;
  }, this));
  this.elem.on('video:triggerSetPlaybackToPercent', $.proxy(function(e, percent) {
    this.doSetPlaybackToPercent(percent); return false;
  }, this));
  this.elem.on('video:triggerModPlaybackByTime', $.proxy(function(e, secondsCount) {
    this.doModPlaybackByTime(secondsCount); return false;
  }, this));
  this.elem.on('video:triggerModPlaybackByFrames', $.proxy(function(e, frameCount) {
    this.doModPlaybackByFrames(frameCount); return false;
  }, this));
  this.elem.on('video:triggerModPlaybackByPercent', $.proxy(function(e, percent) {
    this.doModPlaybackByPercent(percent); return false;
  }, this));

  // settings triggers

  this.elem.on('video:triggerMute', $.proxy(function(e) {
    this.doMute(); return false;
  }, this));
  this.elem.on('video:triggerUnmute', $.proxy(function(e) {
    this.doUnmute(); return false;
  }, this));
  this.elem.on('video:triggerToggleMute', $.proxy(function(e) {
    this.doToggleMute(); return false;
  }, this));
  this.elem.on('video:triggerSetVolumeToPercent', $.proxy(function(e, percent) {
    this.doSetVolumeToPercent(percent); return false;
  }, this));
  this.elem.on('video:triggerModVolumeByPercent', $.proxy(function(e, percent) {
    this.doModVolumeByPercent(percent); return false;
  }, this));
  this.elem.on('video:triggerSetPlaybackRate', $.proxy(function(e, rate) {
    this.doSetPlaybackToRate(rate); return false;
  }, this));
  this.elem.on('video:triggerModPlaybackRate', $.proxy(function(e, rate) {
    this.doModPlaybackByRate(rate); return false;
  }, this));

  // fullscreen triggers

  this.elem.on('video:triggerEnterFullscreen', $.proxy(function(e) {
    this.doEnterFullscreen(); return false;
  }, this));
  this.elem.on('video:triggerExitFullscreen', $.proxy(function(e) {
    this.doExitFullscreen(); return false;
  }, this));
  this.elem.on('video:triggerToggleFullscreen', $.proxy(function(e) {
    this.doToggleFullscreen(); return false;
  }, this));

  // load triggers

  this.elem.on('video:triggerLoad', $.proxy(function(e) {
    this.doLoad(); return false;
  }, this));
  this.elem.on('video:triggerModSource', $.proxy(function(e, source) {
    this.doModSource(source); return false;
  }, this));

}

RomoVideo.prototype._onDocumentFullscreenChange = function(e) {
  if (this._getCurrentFullscreenElem() === this.fullscreenElem[0]) {
    this.fullScreen = true;
    this.elem.trigger('video:enterFullscreen', [this.videoObj, this]);
    this.elem.trigger('video:fullscreenChange', [this.videoObj, this]);
  } else if (this.fullScreen === true) {
    this.fullScreen = false;
    this.elem.trigger('video:exitFullscreen', [this.videoObj, this]);
    this.elem.trigger('video:fullscreenChange', [this.videoObj, this]);
  }
}

RomoVideo.prototype._getCurrentFullscreenElem = function() {
  return document.fullscreenElement        ||
         document.mozFullScreenElement     ||
         document.msFullscreenElement      ||
         document.webkitFullscreenElement;
}

RomoVideo.prototype._requestFullscreen = function() {
  if (this._canFullscreen()) {
    this._browserRequestFullscreen.apply(this.fullscreenElem[0]);
  } else {
    return false;
  }
}

RomoVideo.prototype._exitFullscreen = function() {
  if (this._canFullscreen()) {
    this._browserExitFullscreen.apply(document);
  } else {
    return false;
  }
}

RomoVideo.prototype._canFullscreen = function() {
  if (this._browserRequestFullscreen === undefined || this._browserExitFullscreen === undefined) {
    return false;
  }

  if (document.fullscreenEnabled !== undefined) {
    return document.fullscreenEnabled;
  } else if (document.mozFullScreenEnabled !== undefined) {
    return document.mozFullScreenEnabled;
  } else if (document.msFullscreenEnabled !== undefined) {
    return document.msFullscreenEnabled;
  } else if (document.webkitFullscreenEnabled !== undefined) {
    return document.webkitFullscreenEnabled;
  } else {
    return false;
  }
}

RomoVideo.prototype._getBrowserRequestFullscreen = function(fullscreenElem) {
  // look for the browser-specific requestFullscreen function and return it

  if (fullscreenElem[0].requestFullscreen) {
    return fullscreenElem[0].requestFullscreen;
  } else if (fullscreenElem[0].mozRequestFullScreen) {
    return fullscreenElem[0].mozRequestFullScreen;
  } else if (fullscreenElem[0].msRequestFullscreen) {
    return fullscreenElem[0].msRequestFullscreen;
  } else if (fullscreenElem[0].webkitRequestFullscreen) {
    return this.fullscreenElem[0].webkitRequestFullscreen;
  } else {
    return undefined;
  }
}

RomoVideo.prototype._getBrowserExitFullscreen = function(fullscreenElem) {
  // look for the browser-specific exitFullscreen function and return it
  // we use the document because any non-video fullscreen containers will not
  // have this function, calling the document function will exit anything that
  // has been fullscreened

  if (document.exitFullscreen) {
    return document.exitFullscreen;
  } else if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen;
  } else if (document.msExitFullscreen) {
    return document.msExitFullscreen;
  } else if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen;
  } else {
    return undefined;
  }
}

Romo.onInitUI(function(e) {
  Romo.initUIElems(e, '[data-romo-video-auto="true"]').romoVideo();
});
