var RomoVideo = function(elem) {
  this.elem = elem;

  this.doInit();
  this._bindElem()

  Romo.trigger(this.elem, 'romoVideo:ready', [this.videoObj, this]);
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
  Romo.trigger(this.elem, 'romoVideo:volumechange', [this.videoObj, this]);
}

RomoVideo.prototype.doUnmute = function() {
  this.videoObj.muted = false;
  Romo.trigger(this.elem, 'romoVideo:volumechange', [this.videoObj, this]);
}

RomoVideo.prototype.doToggleMute = function() {
  this.videoObj.muted = !this.videoObj.muted;
  Romo.trigger(this.elem, 'romoVideo:volumechange', [this.videoObj, this]);
}

RomoVideo.prototype.getLoop = function() {
  return this.videoObj.loop;
}

RomoVideo.prototype.doLoop = function() {
  this.videoObj.loop = true;
  Romo.trigger(this.elem, 'romoVideo:loop',       [this.videoObj, this]);
  Romo.trigger(this.elem, 'romoVideo:loopChange', [true, this.videoObj, this]);
}

RomoVideo.prototype.doNoLoop = function() {
  this.videoObj.loop = false;
  Romo.trigger(this.elem, 'romoVideo:noloop',     [this.videoObj, this]);
  Romo.trigger(this.elem, 'romoVideo:loopChange', [false, this.videoObj, this]);
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
  if (isNaN(parseInt(seconds)) === true || seconds === 0) {
    if (this.showMs !== false) {
      return '00:00.000';
    } else {
      return '00:00';
    }
  }

  var abs  = Math.abs(seconds);
  var hrs  = Math.floor(abs / 3600);
  var mins = Math.floor((abs - (hrs * 3600)) / 60);
  var secs = Math.floor(abs % 60);

  var t = (hrs ? hrs + ':' : '') +
          (mins < 10 ? '0' : '') + mins + ':' +
          (secs < 10 ? '0' : '') + secs;
  if (this.showMs !== false) {
    t += (abs - Math.floor(abs)).toFixed(3).slice(1);
  }

  if (seconds > 0){ return t; }
  else{ return '-'+t; }
}

// private

RomoVideo.prototype._bindElem = function() {
  this.videoObj = this.elem;

  this.durationTime   = undefined;
  this.durationFrames = undefined;
  Romo.on(this.elem, 'loadedmetadata', Romo.proxy(function(e) {
    this.durationTime   = this.getDurationTime();
    this.durationFrames = this.getDurationFrames();
  }, this));

  this._bindFullscreen();
  this._bindVideoElemEvents();
  this._bindVideoTriggerEvents();
  this._loadState();
}

RomoVideo.prototype._bindVideoElemEvents = function() {
  // playback events

  Romo.on(this.elem, 'play', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:play', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'pause', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:pause', [this.videoObj, this]);
  }, this));

  // state events

  Romo.on(this.elem, 'playing', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:playing', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'waiting', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:waiting', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'ended',  Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:ended', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'emptied', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:emptied', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'error', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:error', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'stalled', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:stalled', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'suspend', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:suspend', [this.videoObj, this]);
  }, this));

  // status events

  Romo.on(this.elem, 'progress', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:progress', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'timeupdate', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:timeupdate', [this.videoObj, this]);
  }, this));

  // settings events

  Romo.on(this.elem, 'volumechange', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:volumechange', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'durationchange', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:durationchange', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'ratechange', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:ratechange', [this.videoObj, this]);
  }, this));

  // load events

  Romo.on(this.elem, 'loadstart', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:loadstart', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'loadedmetadata', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:loadedmetadata', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'loadeddata', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:loadeddata', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'canplay', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:canplay', [this.videoObj, this]);
  }, this));
  Romo.on(this.elem, 'canplaythrough', Romo.proxy(function(e) {
    Romo.trigger(this.elem, 'romoVideo:canplaythrough', [this.videoObj, this]);
  }, this));
}

RomoVideo.prototype._bindVideoTriggerEvents = function() {
  // playback triggers

  Romo.on(this.elem, 'romoVideo:triggerPlay', Romo.proxy(function(e) {
    this.doPlay(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerPause', Romo.proxy(function(e) {
    this.doPause(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerTogglePlay', Romo.proxy(function(e) {
    this.doTogglePlay(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerSetPlaybackToTime', Romo.proxy(function(e, secondNum) {
    this.doSetPlaybackToTime(secondNum); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerSetPlaybackToFrame', Romo.proxy(function(e, frameNum) {
    this.doSetPlaybackToFrame(frameNum); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerSetPlaybackToPercent', Romo.proxy(function(e, percent) {
    this.doSetPlaybackToPercent(percent); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerModPlaybackByTime', Romo.proxy(function(e, secondsCount) {
    this.doModPlaybackByTime(secondsCount); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerModPlaybackByFrames', Romo.proxy(function(e, frameCount) {
    this.doModPlaybackByFrames(frameCount); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerModPlaybackByPercent', Romo.proxy(function(e, percent) {
    this.doModPlaybackByPercent(percent); return false;
  }, this));

  // settings triggers

  Romo.on(this.elem, 'romoVideo:triggerMute', Romo.proxy(function(e) {
    this.doMute(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerUnmute', Romo.proxy(function(e) {
    this.doUnmute(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerToggleMute', Romo.proxy(function(e) {
    this.doToggleMute(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerSetVolumeToPercent', Romo.proxy(function(e, percent) {
    this.doSetVolumeToPercent(percent); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerModVolumeByPercent', Romo.proxy(function(e, percent) {
    this.doModVolumeByPercent(percent); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerSetPlaybackRate', Romo.proxy(function(e, rate) {
    this.doSetPlaybackToRate(rate); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerModPlaybackRate', Romo.proxy(function(e, rate) {
    this.doModPlaybackByRate(rate); return false;
  }, this));

  // fullscreen triggers

  Romo.on(this.elem, 'romoVideo:triggerEnterFullscreen', Romo.proxy(function(e) {
    this.doEnterFullscreen(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerExitFullscreen', Romo.proxy(function(e) {
    this.doExitFullscreen(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerToggleFullscreen', Romo.proxy(function(e) {
    this.doToggleFullscreen(); return false;
  }, this));

  // load triggers

  Romo.on(this.elem, 'romoVideo:triggerLoad', Romo.proxy(function(e) {
    this.doLoad(); return false;
  }, this));
  Romo.on(this.elem, 'romoVideo:triggerModSource', Romo.proxy(function(e, source) {
    this.doModSource(source); return false;
  }, this));

}

RomoVideo.prototype._bindFullscreen = function() {
  var fullscreenElem = Romo.closest(this.elem, Romo.data(this.elem, 'romo-video-fullscreen-elem'));
  if (fullscreenElem !== undefined) {
    this.fullscreenElem = fullscreenElem;
  } else {
    this.fullscreenElem = this.elem;
  }

  this._browserRequestFullscreen = this._getBrowserRequestFullscreen(this.fullscreenElem);
  this._browserExitFullscreen    = this._getBrowserExitFullscreen();

  Romo.on(document, 'fullscreenchange',       Romo.proxy(this._onDocumentFullscreenChange, this));
  Romo.on(document, 'mozfullscreenchange',    Romo.proxy(this._onDocumentFullscreenChange, this));
  Romo.on(document, 'msfullscreenchange',     Romo.proxy(this._onDocumentFullscreenChange, this));
  Romo.on(document, 'webkitfullscreenchange', Romo.proxy(this._onDocumentFullscreenChange, this));
}

RomoVideo.prototype._loadState = function() {
  this.fps = Romo.data(this.elem, 'romo-video-fps');
  if (this.fps && this.fps > 0) {
    this.fpsEnabled = true;
  } else {
    this.fpsEnabled = false;
  }
  this.showMs = Romo.data(this.elem, 'romo-video-show-ms');
}

RomoVideo.prototype._setPlayback = function(newSecondNum) {
  var durationTime = this.getDurationTime();
  if (newSecondNum > durationTime) {
    if (this.getLoop() === true){
      this.videoObj.currentTime = newSecondNum - durationTime;
    } else {
      this.videoObj.currentTime = durationTime;
    }
  } else if (newSecondNum < 0) {
    if (this.getLoop() === true){
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

RomoVideo.prototype._onDocumentFullscreenChange = function(e) {
  if (this._getCurrentFullscreenElem() === this.fullscreenElem) {
    this.fullScreen = true;
    Romo.trigger(this.elem, 'romoVideo:enterFullscreen',  [this.videoObj, this]);
    Romo.trigger(this.elem, 'romoVideo:fullscreenChange', [this.videoObj, this]);
  } else if (this.fullScreen === true) {
    this.fullScreen = false;
    Romo.trigger(this.elem, 'romoVideo:exitFullscreen',   [this.videoObj, this]);
    Romo.trigger(this.elem, 'romoVideo:fullscreenChange', [this.videoObj, this]);
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
    this._browserRequestFullscreen.apply(this.fullscreenElem);
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

  if (fullscreenElem.requestFullscreen) {
    return fullscreenElem.requestFullscreen;
  } else if (fullscreenElem.mozRequestFullScreen) {
    return fullscreenElem.mozRequestFullScreen;
  } else if (fullscreenElem.msRequestFullscreen) {
    return fullscreenElem.msRequestFullscreen;
  } else if (fullscreenElem.webkitRequestFullscreen) {
    return this.fullscreenElem.webkitRequestFullscreen;
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

Romo.onInitUI(function(elem) {
  Romo.initUIElems(elem, '[data-romo-video-auto="true"]').forEach(function(elem) { new RomoVideo(elem); });
});
