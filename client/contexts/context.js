import React, { useContext, useEffect, useRef, useState } from 'react';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [mediaWizard, setMediaWizard] = useState({
    currentStep: 0,
    selectedFile: null,
  });

  const [moviesAndTVSearchInput, setMoviesAndTVSearchInput] = useState('');
  const [moviesAndTVPlayerState, setMoviesAndTVPlayerState] = useState('');

  const [musicSearchInput, setMusicSearchInput] = useState('');

  const REPEAT_STATES = Object.freeze({
    REPEAT_OFF: 0,
    REPEAT_ALL: 1,
    REPEAT_ONE: 2,
  });

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation
  const volumeBar = useRef(); // reference our volume bar

  const [playerState, setPlayerState] = useState({
    currentIndex: null,
    playlist: [],
    currentSong: null,
    isPlaying: false,
    currentTime: null,
    duration: null,
    isMuted: false,
    currentVolume: 0.7,
    repeat: REPEAT_STATES.REPEAT_OFF,
    shuffle: false,
  });

  useEffect(() => {
    if (playerState.currentTime >= playerState.duration) {
      nextSong();
    }
    //console.log("use effect C")
  }, [playerState?.currentTime]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = playerState.isPlaying;
    setPlayerState((playerState) => ({
      ...playerState,
      isPlaying: !prevValue,
    }));

    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changeCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeProgress = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changeCurrentTime();
  };

  const changeCurrentTime = () => {
    //console.log(`progressBar.current.value / playerState.duration: ${progressBar.current.value} / ${playerState.duration}`)
    progressBar.current.style.setProperty(
      '--seek-before-width',
      `${(progressBar.current.value / audioPlayer.current.duration) * 100}%`
    );
    setPlayerState((playerState) => ({
      ...playerState,
      currentTime: progressBar.current.value,
    }));
  };

  const changeVolume = () => {
    audioPlayer.current.volume = playerState.isMuted
      ? 0
      : volumeBar.current.value / 100;
    volumeBar.current.style.setProperty(
      '--seek-before-width',
      `${volumeBar.current.value}%`
    );
    setPlayerState((playerState) => ({
      ...playerState,
      currentVolume: volumeBar.current.value,
    }));
    //console.log(`volumeBar.current.value: ${volumeBar.current.value}, playerState.currentVolume: ${playerState.currentVolume}`)
  };

  const toggleMute = () => {
    const prevValue = playerState.isMuted;
    setPlayerState((playerState) => ({
      ...playerState,
      isMuted: !prevValue,
    }));

    if (!prevValue) {
      audioPlayer.current.volume = 0;
    } else {
      audioPlayer.current.volume = playerState.currentVolume / 100;
    }
  };

  const songChanged = () => {
    //console.log(`audioPlayer.current.duration: ${audioPlayer.current.duration}`)
    const seconds = Math.floor(audioPlayer.current.duration);

    setPlayerState((playerState) => ({
      ...playerState,
      isPlaying: true,
      duration: seconds,
    }));
    progressBar.current.max = seconds;

    audioPlayer.current.pause();
    audioPlayer.current.play();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeSong = (songId, playlist) => {
    let index = playlist.findIndex((item) => item.id === songId);

    setPlayerState((playerState) => ({
      ...playerState,
      currentSong: playlist[index],
      playlist: playlist,
      currentIndex: index,
    }));
  };

  const nextSong = () => {
    if (
      audioPlayer.current &&
      playerState.repeat === REPEAT_STATES.REPEAT_ONE
    ) {
      audioPlayer.current.currentTime = 0;
      return;
    }
    setPlayerState((playerState) => {
      if (playerState.currentIndex >= playerState.playlist.length - 1) {
        return { ...playerState, currentIndex: 0 };
      } else {
        return { ...playerState, currentIndex: playerState.currentIndex + 1 };
      }
    });

    //console.log(`playerState.currentIndex: ${playerState.currentIndex}, playerState.playlist.length: ${playerState.playlist.length}`)
    if (playerState.currentIndex !== playerState.playlist.length) {
      setPlayerState((playerState) => ({
        ...playerState,
        currentSong: playerState.playlist[playerState.currentIndex],
      }));
    }
  };

  const previousSong = () => {
    setPlayerState((playerState) => {
      if (playerState.currentIndex <= 0) {
        return {
          ...playerState,
          currentIndex: playerState.playlist.length - 1,
        };
      } else {
        return { ...playerState, currentIndex: playerState.currentIndex - 1 };
      }
    });

    setPlayerState((playerState) => ({
      ...playerState,
      currentSong: playerState.playlist[playerState.currentIndex],
    }));
  };

  const toggleRepeat = () => {
    if (playerState.repeat === REPEAT_STATES.REPEAT_OFF) {
      setPlayerState((playerState) => ({
        ...playerState,
        repeat: REPEAT_STATES.REPEAT_ALL,
      }));
    } else if (playerState.repeat === REPEAT_STATES.REPEAT_ALL) {
      setPlayerState((playerState) => ({
        ...playerState,
        repeat: REPEAT_STATES.REPEAT_ONE,
      }));
    } else if (playerState.repeat === REPEAT_STATES.REPEAT_ONE) {
      setPlayerState((playerState) => ({
        ...playerState,
        repeat: REPEAT_STATES.REPEAT_OFF,
      }));
    }
    //console.log(`playerState.repeat: ${playerState.repeat}`)
  };

  const toggleShuffle = () => {
    const prevValue = playerState.shuffle;
    setPlayerState((playerState) => ({
      ...playerState,
      shuffle: !prevValue,
    }));
    //console.log(`playerState.shuffle: ${playerState.shuffle}`)
  };

  return (
    <AppContext.Provider
      value={{
        mediaWizard,
        setMediaWizard,
        moviesAndTVSearchInput,
        setMoviesAndTVSearchInput,
        moviesAndTVPlayerState,
        setMoviesAndTVPlayerState,
        musicSearchInput,
        setMusicSearchInput,
        playerState,
        audioPlayer,
        progressBar,
        animationRef,
        volumeBar,
        togglePlayPause,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        REPEAT_STATES,
        changeProgress,
        changeVolume,
        calculateTime,
        songChanged,
        changeSong,
        nextSong,
        previousSong,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

//global hook
const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
