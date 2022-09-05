import React, { useEffect, useRef, useState } from "react";
import { millisToMinutesAndSeconds, useBar } from "../../utils";
import style from "./NowPlayingBar.module.css";
import Like from "../../assets/NowPlayingBar/Like";
import Play from "../../assets/NowPlayingBar/Play";
import Pause from "../../assets/NowPlayingBar/Pause";
import Volume from "../../assets/NowPlayingBar/Volume";
import VolumeMuted from "../../assets/NowPlayingBar/VolumeMuted";
import { useSharedState } from "../../hooks/useSharedState"
import { useGlobalContext } from '../../contexts/context'

const NowPlayingBar = () => {
  const { audioPlayer, progressBar, volumeBar, playerState, togglePlayPause, toggleMute, changeVolume, changeProgress, calculateTime } = useGlobalContext();

  playerState && console.log(`currentSong is ${playerState.currentSong?.name}, idOfSong is ${playerState.idOfSong}`)

  if (!playerState.currentSong) {
    return null;
  } else {
    return (    
      <div className={style.Player}>

          {/* Left */}
          <div className={style.Song}>
            <div className={style.Img}>
              <img src={playerState.currentSong.album_image_url} alt="currentSong" />
            </div>
            <div className={style.Infos}>
              <div className={style.Name}>{playerState.currentSong.name}</div>
              <div className={style.Artist}>{playerState.currentSong.artists[0].name}</div>
            </div>
            <div className={style.Like}>
              <Like />
            </div>
          </div>

          {/* Middle */}
          <div className={style.Controls}>
            <div>
              <button onClick={togglePlayPause}>
                {playerState.isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
            <div className={style.BarContainer}>
              <div className={style.currentTime}>{calculateTime(playerState.currentTime)}</div>
              <input type="range" className={style.progressBar} defaultValue="0" ref={progressBar} onChange={changeProgress} />
              <div className={style.duration}>{(playerState.duration && !isNaN(playerState.duration)) && calculateTime(playerState.duration)}</div>
            </div>
          </div>

          {/* Right */}
          <div className={style.Volume}>
            <div>
              <button onClick={toggleMute}>
                {playerState.isMuted ? <VolumeMuted /> : <Volume />}
              </button>
            </div>
            <input type="range" className={style.progressBar} defaultValue="70" ref={volumeBar} onChange={changeVolume} />
          </div>

        <audio ref={audioPlayer} src={`${process.env.REACT_APP_HOMEHOST_BASE}${playerState.currentSong.url_path}`} preload='metadata'></audio>
      </div>
    );
  }
};

export default NowPlayingBar;