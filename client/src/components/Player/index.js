import React, { useEffect, useRef, useState, useContext } from 'react';
import playerContext from "../Player/context"
import ReactNetflixPlayer from "react-netflix-player";

  
const Player = () => {

  const context = useContext(playerContext)

  const openFullscreen = () => {
    var elem = document.getElementById("player");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
    
  }

  useEffect(() => {

    {context.playerItem && openFullscreen()}

  }, [])

    // movie -> title, episode -> name
    // dont show next episode icon if last episode
    // dont show next episode and episode list icons if movie
    return (
      <React.Fragment>
      {context.playerItem && (
        <div id={"player"} >
          <ReactNetflixPlayer
            src={context.playerItem.url_path}
            // paused 
            title={context.playerItem.title}
            subTitle={context.playerItem.name}
            // media bar
            titleMedia={context.playerItem.title}
            extraInfoMedia="Opening"
            playerLanguage="en"
            backButton={() => { context.setPlayerItem(null) }}
            // The player uses all the viewport
            fullPlayer
            autoPlay
            startPosition={0}
            // The info of the next video action
            dataNext={{ title: 'No next episode' }}
            // The action call when the next video is clicked
            onNextClick={() => {}}
            // The list reproduction data, will be render in this order
            reprodutionList={[
              {
                nome: 'Opening',
                id: 1,
                playing: true,
              },
              {
                nome: 'Teste',
                id: 2,
                playing: false,
              },
            ]}
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