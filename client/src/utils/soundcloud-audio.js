'use strict';

function SoundCloud (clientId) {
  if (!(this instanceof SoundCloud)) {
    return new SoundCloud(clientId);
  }

  this._events = {};
  this.playing = false;
  this.duration = 0;
  this.audio = document.createElement('audio');
}

SoundCloud.prototype.playlist = function (data, callback) {
  
  if (data) {
    this._playlist = data;
    //this._track = data;

    if (data.tracks) {
      for (var i = 0; i < data.tracks.items.length; i++) { 
        this.duration += data.tracks.items[i].duration_ms;
      }
      this.duration = this.duration / 1000;
    }
  }

};

SoundCloud.prototype.on = function (e, fn) {
  this._events[e] = fn;
  this.audio.addEventListener(e, fn, false);
};

SoundCloud.prototype.off = function (e, fn) {
  this._events[e] = null;
  this.audio.removeEventListener(e, fn);
};

SoundCloud.prototype.unbindAll = function () {
  for (var e in this._events) {
    var fn = this._events[e];
    if (fn) {
      this.off(e, fn);
    }
  }
};

SoundCloud.prototype.preload = function (streamUrl, preloadType) {
  this._track = {preview_url: streamUrl};

  if (preloadType) {
    this.audio.preload = preloadType;
  }

  this.audio.src = streamUrl;
};

SoundCloud.prototype.play = function (options) {
  options = options || {};
  var src;

  if (options.streamUrl) {
    src = options.streamUrl;
  } else if (this._playlist) {
    var length = this._playlist.tracks.items.length;
    if (length) {
      if (options.playlistIndex === undefined) {
        this._playlistIndex = this._playlistIndex || 0;
      } else {
        this._playlistIndex = options.playlistIndex;
      }

      // be silent if index is out of range
      if (this._playlistIndex >= length || this._playlistIndex < 0) {
        this._playlistIndex = 0;
        return;
      }
      src = this._playlist.tracks.items[this._playlistIndex].preview_url;
    }
  } else if (this._track) {
    src = this._track.preview_url;
  }

  if (!src) {
    return;
    throw new Error('There is no tracks to play, use `streamUrl` option or `load` method');
  }

  if (src !== this.audio.src) {
    this.audio.src = src;
  }

  this.playing = src;

  return this.audio.play();
};

SoundCloud.prototype.pause = function () {
  this.audio.pause();
  this.playing = false;
};

SoundCloud.prototype.stop = function () {
  this.audio.pause();
  this.audio.currentTime = 0;
  this.playing = false;
};

SoundCloud.prototype.next = function (options) {
  options = options || {};
  var tracksLength = this._playlist.tracks.length;

  if (this._playlistIndex >= tracksLength - 1) {
    if (options.loop) {
      this._playlistIndex = -1;
    } else {
      return;
    }
  }

  if (this._playlist && tracksLength) {
    return this.play({playlistIndex: ++this._playlistIndex});
  }
};

SoundCloud.prototype.previous = function () {
  if (this._playlistIndex <= 0) {
    return;
  }

  if (this._playlist && this._playlist.tracks.length) {
    return this.play({playlistIndex: --this._playlistIndex});
  }
};

SoundCloud.prototype.seek = function (e) {
  if (!this.audio.readyState) {
    return false;
  }

  var percent = e.offsetX / e.target.offsetWidth || (e.layerX - e.target.offsetLeft) / e.target.offsetWidth;

  this.audio.currentTime = percent * (this.audio.duration || 0);
};

SoundCloud.prototype.cleanData = function () {
  this._track = void 0;
  this._playlist = void 0;
};

SoundCloud.prototype.setVolume = function (volumePercentage) {
  if (!this.audio.readyState) {
    return;
  }

  this.audio.volume = volumePercentage;
};

SoundCloud.prototype.setTime = function (seconds) {
  if (!this.audio.readyState) {
    return;
  }

  this.audio.currentTime = seconds;
};

module.exports = SoundCloud;