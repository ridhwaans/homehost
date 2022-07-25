import React, { useEffect, useRef, useState } from "react";
import { millisToMinutesAndSeconds, useBar } from "../../utils";
import style from "./NowPlayingBar.module.css";
import Like from "../../assets/NowPlayingBar/Like";
import Play from "../../assets/NowPlayingBar/Play";
import Pause from "../../assets/NowPlayingBar/Pause";
import Volume from "../../assets/NowPlayingBar/Volume";
import VolumeMuted from "../../assets/NowPlayingBar/VolumeMuted";
import { useSharedState } from "../../hooks/useSharedState"

const NowPlayingBar = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0.7);

  // references
  const audioPlayer = useRef();   // reference our audio component
  const progressBar = useRef();   // reference our progress bar
  const animationRef = useRef();  // reference the animation
  const volumeBar = useRef();  // reference our volume bar

  const [currentSong, setCurrentSong] = useSharedState('currentSong')

  const barCallBack = useBar;
  if (currentSong && currentSong.preview_url != null && currentSong.url_path == null){
    currentSong.url_path = currentSong.preview_url;
    currentSong.duration_ms = 30000;
  }

  useEffect(() => {
    if (!audioPlayer.current) return;
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying)
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
    console.log(`currentSong is `)
    console.log(currentSong)
  }

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  }

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
    setCurrentTime(progressBar.current.value);
  }

  const changeVolume = () => {
    audioPlayer.current.volume = isMuted ? 0 : volumeBar.current.value / 100;
    volumeBar.current.style.setProperty('--seek-before-width', `${volumeBar.current.value}%`)
    setCurrentVolume(volumeBar.current.value)
    console.log(`volumeBar ${volumeBar.current.value}, currentVolume ${currentVolume}`)
  }

  const toggleMute = () => {
    const prevValue = isMuted;
    setIsMuted(!prevValue);
    if (!prevValue) {
      audioPlayer.current.volume = 0
    } else {
      audioPlayer.current.volume = currentVolume / 100
    }
  }

  if (!currentSong) {
    return null;
  } else {
    return (    
      <div className={style.Player}>

          {/* Left */}
          <div className={style.Song}>
            <div className={style.Img}>
              <img src={currentSong.album_image_url} alt="currentSong" />
            </div>
            <div className={style.Infos}>
              <div className={style.Name}>{currentSong.name}</div>
              <div className={style.Artist}>{currentSong.artists[0].name}</div>
            </div>
            <div className={style.Like}>
              <Like />
            </div>
          </div>

          {/* Middle */}
          <div className={style.Controls}>
            <div>
              <button onClick={togglePlayPause}>
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
            <div className={style.BarContainer}>
              <div className={style.currentTime}>{calculateTime(currentTime)}</div>
              <input type="range" className={style.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange} />
              <div className={style.duration}>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
            </div>
          </div>

          {/* Right */}
          <div className={style.Volume}>
            <div>
              <button onClick={toggleMute}>
                {isMuted ? <VolumeMuted /> : <Volume />}
              </button>
            </div>
            <input type="range" className={style.progressBar} defaultValue="70" ref={volumeBar} onChange={changeVolume} />
          </div>

        <audio ref={audioPlayer} src={`${process.env.REACT_APP_HOMEHOST_BASE}${currentSong.url_path}`} preload="metadata"></audio>
      </div>
    );
  }
};

export default NowPlayingBar;