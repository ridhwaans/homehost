import React, { useEffect, useContext } from 'react';
import { useSharedState } from "../../hooks/useSharedState"
import { ReactNetflixPlayer } from "react-netflix-player";

  
const Player = () => {
  const [playerItem, setPlayerItem] = useSharedState('playerContext')

  const openFullscreen = () => {
    var elem = document.getElementById("player");
    if (elem?.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem?.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem?.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
    
  }

    playerItem && openFullscreen()
    var episode = null;
    if (playerItem && playerItem.data && playerItem.data.type == "Show") { 
      episode = playerItem.data.seasons
      .find(season => season.season_number == playerItem.season_number).episodes
      .find(episode => episode.episode_number == playerItem.episode_number);
    }
    var episodeList = [];
    if (episode != null) {
      playerItem.data.seasons
      .find(season => season.season_number == playerItem.season_number).episodes
      .map(episode => episodeList.push({id: episode.episode_number, nome: episode.name, playing: false}))
      episodeList.find(episode => episode.id == playerItem.episode_number).playing = true;
    }
    var nextEpisode = null;
    if (episode != null) {
      if (playerItem.episode_number == episodeList.length) {
        nextEpisode = {}
      } else {
        nextEpisode = episodeList[playerItem.episode_number]
      }
    }
    console.log(playerItem && `playerItem is ${playerItem}`)
    // source: https://github.com/Lucasmg37/react-netflix-player/blob/master/example/index.js
    return (
      <React.Fragment>
      {playerItem && (
        <div id={"player"} >
          <ReactNetflixPlayer
            src={`${process.env.REACT_APP_HOMEHOST_BASE}${playerItem.type == "Movie" ? playerItem.url_path : episode.url_path}`}
            // Pause screen 
            // movie or show name
            title={playerItem.type == "Movie" ? playerItem.title : playerItem.data.name}
            // episode name
            subTitle={playerItem.type == "Movie" ? "" : `S${playerItem.season_number}E${playerItem.episode_number} ${episode.name}`}
            // Player bar
            // movie or show name
            titleMedia={playerItem.type == "Movie" ? playerItem.title : playerItem.data.name}
            // episode name
            extraInfoMedia={playerItem.type == "Movie" ? "" : `S${playerItem.season_number}E${playerItem.episode_number} ${episode.name}`}
            playerLanguage="en"
            backButton={() => { setPlayerItem(null) }}
            // The player uses all the viewport
            fullPlayer
            autoPlay
            startPosition={0}
            // The info of the next video action
            dataNext={playerItem.type == "Movie" ? {} : {title: nextEpisode.nome} }
            // The action call when the next video is clicked
            onNextClick={() => {}}
            // The list reproduction data, will be render in this order
            reprodutionList={playerItem.type == "Movie" ? [] : episodeList}
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
}
export default Player