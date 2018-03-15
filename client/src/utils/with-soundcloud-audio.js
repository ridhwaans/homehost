import React, { Component } from 'react';
import SoundCloudAudio from './soundcloud-audio';
import hoistStatics from 'hoist-non-react-statics';
import {
  stopAllOther,
  addToPlayedStore,
  resetPlayedStore
} from './audioStore.js';

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withSoundCloudAudio (WrappedComponent) {
  class WithSoundCloudAudio extends Component {
    constructor(props, context) {
      super(props, context);

      if (!props.clientId && !props.soundCloudAudio && !props.streamUrl) {
        console.warn(
          `You need to get a clientId from SoundCloud,
          pass in an instance of SoundCloudAudio
          or use streamUrl with audio source instead
          https://github.com/soundblogs/react-soundplayer#examples`
        );
      }

      // Don't create a SoundCloudAudio instance
      // if there is no `window`
      if ('undefined' !== typeof window) {
        if (props.soundCloudAudio) {
          this.soundCloudAudio = props.soundCloudAudio;
        } else {
          this.soundCloudAudio = new SoundCloudAudio(props.clientId);
        }
      }

      this.state = {
        duration: 0,
        currentTime: 0,
        seeking: false,
        playing: false,
        volume: 1,
        isMuted: false
      };
    }

    componentDidMount() {
      this.mounted = true;

      this.requestAudio();
      this.listenAudioEvents();
    }

    componentWillUnmount() {
      this.mounted = false;

      resetPlayedStore();
      this.soundCloudAudio.unbindAll();
    }

    requestAudio() {
      const { soundCloudAudio } = this;
      const {
        data,
        streamUrl,
        preloadType,
        onReady
      } = this.props;

      if (streamUrl) {
        soundCloudAudio.preload(streamUrl, preloadType);
      } else if (data) {
        soundCloudAudio.playlist(data, (data) => {
          if (!this.mounted) {
            return;
          }

          this.setState({
            [data.tracks.items.length > 1 ? 'playlist' : 'track']: data
          }, () => onReady && onReady());
        });
      }
    }

    listenAudioEvents() {
      const { soundCloudAudio } = this;

      // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
      soundCloudAudio.on('playing', this.onAudioStarted.bind(this));
      soundCloudAudio.on('timeupdate', this.getCurrentTime.bind(this));
      soundCloudAudio.on('loadedmetadata', this.getDuration.bind(this));
      soundCloudAudio.on('seeking', this.onSeekingTrack.bind(this));
      soundCloudAudio.on('seeked', this.onSeekedTrack.bind(this));
      soundCloudAudio.on('pause', this.onAudioPaused.bind(this));
      soundCloudAudio.on('ended', this.onAudioEnded.bind(this));
      soundCloudAudio.on('volumechange', this.onVolumeChange.bind(this));
    }

    onSeekingTrack() {
      this.setState({seeking: true});
    }

    onSeekedTrack() {
      this.setState({seeking: false});
    }

    onAudioStarted() {
      const { soundCloudAudio } = this;
      const { onStartTrack } = this.props;

      this.setState({playing: true});

      stopAllOther(soundCloudAudio.playing);
      addToPlayedStore(soundCloudAudio);

      onStartTrack && onStartTrack(soundCloudAudio, soundCloudAudio.playing);
    }

    onAudioPaused() {
      const { onPauseTrack } = this.props;

      this.setState({playing: false});

      onPauseTrack && onPauseTrack(this.soundCloudAudio);
    }

    onAudioEnded() {
      const { onStopTrack } = this.props;

      this.setState({playing: false});

      onStopTrack && onStopTrack(this.soundCloudAudio);
    }

    onVolumeChange() {
      this.setState({
        volume: this.soundCloudAudio.audio.volume,
        isMuted: this.soundCloudAudio.audio.muted
      });
    }

    getCurrentTime() {
      this.setState({
        currentTime: this.soundCloudAudio.audio.currentTime
      });
    }

    getDuration() {
      this.setState({
        duration: this.soundCloudAudio.audio.duration
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          soundCloudAudio={this.soundCloudAudio}
          {...this.state}
        />
      );
    }
  }

  WithSoundCloudAudio.displayName = `withSoundCloudAudio(${getDisplayName(WrappedComponent)})`;
  WithSoundCloudAudio.WrappedComponent = WrappedComponent;

  return hoistStatics(WithSoundCloudAudio, WrappedComponent);
}