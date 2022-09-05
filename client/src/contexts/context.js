import React, { useContext, useState, useRef, useEffect } from "react";
import { useSharedState } from "../hooks/useSharedState"
const AppContext = React.createContext();


const AppProvider = ({ children }) => {

  // references
  const audioPlayer = useRef();   // reference our audio component
  const progressBar = useRef();   // reference our progress bar
  const animationRef = useRef();  // reference the animation
  const volumeBar = useRef();  // reference our volume bar

  const [playerState, setPlayerState] = useSharedState('player',
    {
      currentSong: null,
      idOfSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isMuted: false,
      currentVolume: 0.7,
      prevSong: null
    }
  );

  useEffect(() => {
    if (!audioPlayer.current) return;
    const seconds = Math.floor(audioPlayer.current.duration);

    setPlayerState(playerState => ({
      ...playerState, duration: seconds
    }));
    progressBar.current.max = seconds;
    console.log("use effect A " + JSON.stringify(playerState))

  }, [playerState?.currentSong, audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])


  useEffect(() => {
    if (playerState.isPlaying) {
      audioPlayer.current.pause();
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
    console.log("use effect B " + JSON.stringify(playerState))

  }, [playerState?.idOfSong, audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])


  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const togglePlayPause = () => {
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
    changeCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  const changeProgress = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changeCurrentTime();
  }

  const changeCurrentTime = () => {
    console.log(`progressBar.current.value / playerState.duration: ${progressBar.current.value} / ${playerState.duration}`)
    progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / playerState.duration * 100}%`)
    setPlayerState(playerState => ({
      ...playerState, currentTime: progressBar.current.value
    }));
  }

  const changeVolume = () => {
    audioPlayer.current.volume = playerState.isMuted ? 0 : volumeBar.current.value / 100;
    volumeBar.current.style.setProperty('--seek-before-width', `${volumeBar.current.value}%`)
    setPlayerState(playerState => ({
      ...playerState, currentVolume: volumeBar.current.value
    }));
    console.log(`volumeBar.current.value is ${volumeBar.current.value}, currentVolume is ${playerState.currentVolume}`)
  }

  const toggleMute = () => {
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


  const changeSong = (song) => {
    if (song.url_path || song.preview_url) {
      //setCurrentSong(song);
      setPlayerState(playerState => ({
        ...playerState, currentSong: song, idOfSong: song.id
      }));
    }
    console.log("changeSong " + JSON.stringify(playerState))
  };


  //   // TODO NEW PLAYER FUNCTIONALITY
  // const nextSong = () => {
  //     console.log('next');
  //     setIndexOfSong(oldIndex => {
  //         if (oldIndex >= songsList.length) {
  //             return 1
  //         } else {
  //             return oldIndex + 1;
  //         }
  //     })

  //     if (indexOfSong !== songsList.length) {
  //         setCurrentSong(songsList[indexOfSong])
  //     }
  // }
  // const previousSong = () => {
  //     console.log('prev')
  //     setIndexOfSong(oldIndex => {
  //         if (oldIndex <= 1) {
  //             return 0;
  //         }
  //         else {
  //             return oldIndex - 1;
  //         }
  //     })
  //     setCurrentSong(songsList[indexOfSong])
  //     // if (indexOfSong !== 0) {
  //     //     setCurrentSong(songsList[indexOfSong])
  //     // }
  // }

  // const changeFavourite = (id) => {
  //     //find song by finding id of clicked item, and change favourite status of this song
  //     const newSongs = songsList.map(song => {
  //         if (song.id === id) {

  //             return { ...song, favourite: !song.favourite }
  //         }
  //         else {
  //             return song;
  //         }
  //     })
  //     setSongsList(newSongs);
  // }

  // useEffect(() => {
  //     if (currentTime >= duration) {
  //         setIndexOfSong((oldIndex) => {
  //             //check our boundaries so we wont go past our max of songs
  //             if (oldIndex >= songsList.length - 1) {
  //                 return 0
  //             } else {
  //                 return oldIndex + 1;
  //             }
  //         })
  //         //dont setup new song if reached end of playlist or it will cause an error
  //         if (indexOfSong !== songsList.length) {
  //             setCurrentSong(songsList[indexOfSong])
  //         }
  //     }
  //     // eslint-disable-next-line
  // }, [currentTime])


  return <AppContext.Provider value={{
    audioPlayer,
    progressBar,
    animationRef,
    volumeBar,
    playerState,
    togglePlayPause,
    toggleMute,
    changeProgress,
    changeVolume,
    calculateTime,
    changeSong
  }}>
    {children}
  </AppContext.Provider>
}

//global hook
const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppProvider, useGlobalContext }