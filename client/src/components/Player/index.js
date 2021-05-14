import React from 'react';
import ReactNetflixPlayer from "react-netflix-player";

  
const Player = ({ backToBrowse, currentSlide }) => {

    // movie -> title, episode -> name
    // dont show next episode icon if last episode
    // dont show next episode and episode list icons if movie
    return (
        <div id={"player"}>
          <ReactNetflixPlayer
            src={currentSlide.url_path}
            // paused 
            title={currentSlide.title}
            subTitle={currentSlide.name}
            // media bar
            titleMedia={currentSlide.title}
            extraInfoMedia="Opening"
            playerLanguage="en"
            backButton={() => { backToBrowse() }}
            // The player use the all viewport
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
            // The function call when a item in reproductionList is clicked
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
            // Enable the orverlay when player is paused
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
      );
}
export default Player