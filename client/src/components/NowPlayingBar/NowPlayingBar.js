import React from 'react';

import Like from '../../assets/NowPlayingBar/Like';
import Next from '../../assets/NowPlayingBar/Next';
import Pause from '../../assets/NowPlayingBar/Pause';
import Play from '../../assets/NowPlayingBar/Play';
import Previous from '../../assets/NowPlayingBar/Previous';
import { Repeat, RepeatOne } from '../../assets/NowPlayingBar/Repeat';
import Shuffle from '../../assets/NowPlayingBar/Shuffle';
import Volume from '../../assets/NowPlayingBar/Volume';
import VolumeMuted from '../../assets/NowPlayingBar/VolumeMuted';
import { useGlobalContext } from '../../contexts/context';
import style from './NowPlayingBar.module.css';

const NowPlayingBar = () => {
  const {
    audioPlayer,
    progressBar,
    volumeBar,
    playerState,
    togglePlayPause,
    songChanged,
    previousSong,
    nextSong,
    toggleMute,
    changeVolume,
    changeProgress,
    calculateTime,
    REPEAT_STATES,
    toggleRepeat,
    toggleShuffle,
  } = useGlobalContext();

  if (!playerState.currentSong) {
    return null;
  } else {
    return (
      <div className={style.Player}>
        {/* Left */}
        <div className={style.Song}>
          <div className={style.Img}>
            <img
              src={playerState.currentSong.album_image_url}
              alt="currentSong"
            />
          </div>
          <div className={style.Infos}>
            <div className={style.Name}>{playerState.currentSong.name}</div>
            <div className={style.Artist}>
              {playerState.currentSong.artists[0].name}
            </div>
          </div>
          <div className={style.Like}>
            <Like />
          </div>
        </div>

        {/* Middle */}
        <div className={style.Middle}>
          <div className={style.Controls}>
            <button
              className={`${style.iconButton} ${
                playerState.shuffle ? style.activeIcon : ''
              }`}
              onClick={toggleShuffle}
            >
              <Shuffle />
            </button>
            <button className={style.button} onClick={previousSong}>
              <Previous />
            </button>
            <button className={style.playButton} onClick={togglePlayPause}>
              {playerState.isPlaying ? <Pause /> : <Play />}
            </button>
            <button className={style.button} onClick={nextSong}>
              <Next />
            </button>
            <button
              className={`${style.iconButton} ${
                playerState.repeat !== REPEAT_STATES.REPEAT_OFF
                  ? style.activeIcon
                  : ''
              }`}
              onClick={toggleRepeat}
            >
              {playerState.repeat !== REPEAT_STATES.REPEAT_ONE ? (
                <Repeat />
              ) : (
                <RepeatOne />
              )}
            </button>
          </div>
          <div className={style.BarContainer}>
            <div className={style.currentTime}>
              {calculateTime(playerState.currentTime)}
            </div>
            <input
              type="range"
              className={style.progressBar}
              defaultValue="0"
              ref={progressBar}
              onChange={changeProgress}
            />
            <div className={style.duration}>
              {playerState.duration &&
                !isNaN(playerState.duration) &&
                calculateTime(playerState.duration)}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className={style.Volume}>
          <div>
            <button onClick={toggleMute}>
              {playerState.isMuted ? <VolumeMuted /> : <Volume />}
            </button>
          </div>
          <input
            type="range"
            className={style.progressBar}
            defaultValue="70"
            ref={volumeBar}
            onChange={changeVolume}
          />
        </div>

        <audio
          ref={audioPlayer}
          src={`${process.env.REACT_APP_HOMEHOST_BASE}${playerState.currentSong.url_path}`}
          preload="metadata"
          onLoadedMetadata={songChanged}
        ></audio>
      </div>
    );
  }
};

export default NowPlayingBar;
