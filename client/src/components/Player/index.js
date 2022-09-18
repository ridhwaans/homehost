import React from 'react';
import { ReactNetflixPlayer } from 'react-netflix-player';

import { useGlobalContext } from '../../contexts/context';

const Player = () => {
  const { moviesAndTVPlayerState, setMoviesAndTVPlayerState } =
    useGlobalContext();

  const openFullscreen = () => {
    var elem = document.getElementById('player');
    if (elem?.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem?.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem?.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  moviesAndTVPlayerState && openFullscreen();
  var episode = null;
  if (
    moviesAndTVPlayerState &&
    moviesAndTVPlayerState.data &&
    moviesAndTVPlayerState.data.type === 'Show'
  ) {
    episode = moviesAndTVPlayerState.data.seasons
      .find(
        (season) =>
          season.season_number === moviesAndTVPlayerState.season_number
      )
      .episodes.find(
        (episode) =>
          episode.episode_number === moviesAndTVPlayerState.episode_number
      );
  }
  var episodeList = [];
  if (episode != null) {
    moviesAndTVPlayerState.data.seasons
      .find(
        (season) =>
          season.season_number === moviesAndTVPlayerState.season_number
      )
      .episodes.map((episode) =>
        episodeList.push({
          id: episode.episode_number,
          nome: episode.name,
          playing: false,
        })
      );
    episodeList.find(
      (episode) => episode.id === moviesAndTVPlayerState.episode_number
    ).playing = true;
  }
  var nextEpisode = null;
  if (episode != null) {
    if (moviesAndTVPlayerState.episode_number === episodeList.length) {
      nextEpisode = {};
    } else {
      nextEpisode = episodeList[moviesAndTVPlayerState.episode_number];
    }
  }

  return (
    <React.Fragment>
      {moviesAndTVPlayerState && (
        <div id={'player'}>
          <ReactNetflixPlayer
            src={`${process.env.REACT_APP_HOMEHOST_BASE}${
              moviesAndTVPlayerState.type === 'Movie'
                ? moviesAndTVPlayerState.url_path
                : episode.url_path
            }`}
            // Pause screen
            // movie or show name
            title={
              moviesAndTVPlayerState.type === 'Movie'
                ? moviesAndTVPlayerState.title
                : moviesAndTVPlayerState.data.name
            }
            // episode name
            subTitle={
              moviesAndTVPlayerState.type === 'Movie'
                ? ''
                : `S${moviesAndTVPlayerState.season_number}E${moviesAndTVPlayerState.episode_number} ${episode.name}`
            }
            // Player bar
            // movie or show name
            titleMedia={
              moviesAndTVPlayerState.type === 'Movie'
                ? moviesAndTVPlayerState.title
                : moviesAndTVPlayerState.data.name
            }
            // episode name
            extraInfoMedia={
              moviesAndTVPlayerState.type === 'Movie'
                ? ''
                : `S${moviesAndTVPlayerState.season_number}E${moviesAndTVPlayerState.episode_number} ${episode.name}`
            }
            playerLanguage="en"
            backButton={() => {
              setMoviesAndTVPlayerState(null);
            }}
            // The player uses all the viewport
            fullPlayer
            autoPlay
            startPosition={0}
            // The info of the next video action
            dataNext={
              moviesAndTVPlayerState.type === 'Movie'
                ? {}
                : { title: nextEpisode.nome }
            }
            // The action call when the next video is clicked
            onNextClick={() => {}}
            // The list reproduction data, will be render in this order
            reprodutionList={
              moviesAndTVPlayerState.type === 'Movie' ? [] : episodeList
            }
            // The function call when an item in reproductionList is clicked
            onClickItemListReproduction={(id, playing) => {
              return {
                id,
                playing,
              };
            }}
            // The function is call when the video finish
            onEnded={() => {}}
            // The function is call when the video is playing (One time for frame)
            onTimeUpdate={() => {}}
            // Enable the overlay when player is paused
            overlayEnabled
            // Enabled the auto clode controlls of player
            autoControllCloseEnabled
            // Style
            primaryColor="#db0000"
            secundaryColor="#ffffff"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"

            // subtitleMedia="/file.vtt"
          />
        </div>
      )}
    </React.Fragment>
  );
};
export default Player;
