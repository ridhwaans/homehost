import React, { useEffect, useRef, useState, useContext } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AlbumItem from "../Albums/AlbumItem/AlbumItem"
import ArtistItem from "../Artists/ArtistItem/ArtistItem"
import { SongItemMini } from "../Songs/SongItemMini/SongItemMini"
import style from "./MusicRow.module.css"

const MusicRow = ({ mainTitle, data, music_type, loadSong, currentSong, playPause }) => {

  const songClicked = (song) => {
    if (song.url_path || song.preview_url) {
      loadSong(song);
    }
  };

    return (
      <React.Fragment>
        <div className={style.MusicRow}>
          <div className={style.RowHeader}>
              <span className={style.Title}>{mainTitle}</span>
              <Link style={{ textDecoration: "none", color: "white" }} to={{ pathname: `/music/${music_type}`, state: { data: data } }} >
                  <span>SEE ALL</span>
              </Link>
          </div>

          {(music_type === "albums" || music_type === "artists") && <div className={style.Container}>
            {music_type === "albums" && data && data.map(item => { return <AlbumItem key={item.id} album={item}/> }) }
            {music_type === "artists" && data && data.map(item => { return <ArtistItem key={item.id} artist={item}/> }) }
          </div>}
          
          {(music_type === "songs") && <div className={style.SongItemsContainer}>
            {data && data.map((item, index) => {
              return <SongItemMini
                key={item.id}
                song={item}
                artists={item.artists}
                index={index}
                current={currentSong && item.id === currentSong.id ? true : false}
                songClicked={() => songClicked(item)}
                /> })}
          </div>}

        </div>
      </React.Fragment>
    )
}

const mapStateToProps = (state) => {
  return {
    currentSong: state.playing.song,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadSong: (song) => dispatch({ type: "load", song }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicRow);