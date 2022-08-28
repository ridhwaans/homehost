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
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [duration, setDuration] = useState(0);
  // const [currentTime, setCurrentTime] = useState(0);
  // const [isMuted, setIsMuted] = useState(false);
  // const [currentVolume, setCurrentVolume] = useState(0.7);

  // references
  const audioPlayer = useRef();   // reference our audio component
  const progressBar = useRef();   // reference our progress bar
  const animationRef = useRef();  // reference the animation
  const volumeBar = useRef();  // reference our volume bar

  // const [currentSong, setCurrentSong] = useSharedState('currentSong')

  const [playerState, setPlayerState] = useSharedState('player', 
    {
      currentSong: null,
      idOfSong: 0,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isMuted: false,
      currentVolume: 0.7,
      prevSong: null
    }
  );

  useEffect(() => {
    //setDuration(seconds);
    if (!audioPlayer.current) return;    
      const seconds = Math.floor(audioPlayer.current.duration);
      setPlayerState(playerState => ({
        ...playerState, duration: seconds
      }));

      progressBar.current.max = seconds;
  }, [playerState?.currentSong, audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const onDurationChangeHandler = () => {
    console.log("ondurationchanged")  
  };

  // playerState?.currentSong?.url_path
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const togglePlayPause = () => {
    //const prevValue = isPlaying;
    //setIsPlaying(!prevValue);
    const prevValue = playerState.isPlaying;
    setPlayerState(playerState => ({
      ...playerState, isPlaying: !prevValue
    }));

    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying)
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
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
    progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / playerState.duration * 100}%`)
    //setCurrentTime(progressBar.current.value);
    setPlayerState(playerState => ({
      ...playerState, currentTime: progressBar.current.value
    }));
  }

  const changeVolume = () => {
    audioPlayer.current.volume = playerState.isMuted ? 0 : volumeBar.current.value / 100;
    volumeBar.current.style.setProperty('--seek-before-width', `${volumeBar.current.value}%`)
    //setCurrentVolume(volumeBar.current.value)
    setPlayerState(playerState => ({
      ...playerState, currentVolume: volumeBar.current.value
    }));
    console.log(`volumeBar.current.value is ${volumeBar.current.value}, currentVolume is ${playerState.currentVolume}`)
  }

  const toggleMute = () => {
    //const prevValue = isMuted;
    //setIsMuted(!prevValue);
    const prevValue = playerState.isMuted;
    setPlayerState(playerState => ({
      ...playerState, isMuted: !prevValue
    }));

    if (!prevValue) {
      audioPlayer.current.volume = 0
    } else {
      audioPlayer.current.volume = playerState.currentVolume / 100
    }
  }

  useEffect(() => {
    // AUTO PLAY FUNCTIONALITY
  }, [playerState?.currentTime])

  useEffect(() => {
    console.log("song clicked")
    console.log(`playerState?.isPlaying is ${playerState?.isPlaying}`)
    if (playerState?.isPlaying) {
        audioPlayer.current.pause();
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying)
    }
}, [playerState?.idOfSong, audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])

  //playerState && console.log(`currentTime is ${playerState.currentTime}, duration is ${playerState.duration}, currentSong is ${playerState.currentSong?.name}, is playing: ${playerState.isPlaying}`)
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
              <input type="range" className={style.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange} />
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
            <input type="range" className={style.progressBar} defaultValue="70" ref={playerState.volumeBar} onChange={changeVolume} />
          </div>

        <audio ref={audioPlayer} src={`${process.env.REACT_APP_HOMEHOST_BASE}${playerState.currentSong.url_path}`} preload='metadata'></audio>
      </div>
    );
  }
};

export default NowPlayingBar;