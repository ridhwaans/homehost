import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AlbumItem from "../Albums/AlbumItem/AlbumItem"
import ArtistItem from "../Artists/ArtistItem/ArtistItem"
import { SongItemMini } from "../Songs/SongItemMini/SongItemMini"
import style from "./MusicRow.module.css"
import { useSharedState } from "../../hooks/useSharedState"

const MusicRow = ({ mainTitle, data, musicType }) => {

  //const [currentSong, setCurrentSong] = useSharedState('currentSong', '')
  const [playerState, setPlayerState] = useSharedState('player')

  const songClicked = (song) => {
    if (song.url_path || song.preview_url) {
      //setCurrentSong(song);
      setPlayerState(playerState => ({
        ...playerState, currentSong: song, idOfSong: song.id
      }));
    }
  };

  //console.log("MusicRow data is")
  //console.log(data)
    return (
      <React.Fragment>
        <div className={style.MusicRow}>
          <div className={style.RowHeader}>
              <span className={style.Title}>{mainTitle}</span>
              <Link style={{ textDecoration: "none", color: "white" }} to={{ pathname: `/music/${musicType}`}} state={{ data: data }} >
                  <span>SEE ALL</span>
              </Link>
          </div>

          {(musicType === "albums" || musicType === "artists") && <div className={style.Container}>
            {musicType === "albums" && data && data.map(item => { return <AlbumItem key={item.id} album={item}/> }) }
            {musicType === "artists" && data && data.map(item => { return <ArtistItem key={item.id} artist={item}/> }) }
          </div>}
          
          {(musicType === "songs") && <div className={style.SongItemsContainer}>
            {data && data.map((item, index) => {
              return <SongItemMini
                key={item.id}
                song={item}
                artists={item.artists}
                index={index}
                current={playerState?.currentSong && item.id === playerState.currentSong.id ? true : false}
                songClicked={() => songClicked(item)}
                /> })}
          </div>}

        </div>
      </React.Fragment>
    )
}

export default MusicRow;