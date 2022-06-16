import React from "react";
import NowPlaying from "../../../assets/AlbumDetail/NowPlaying.gif";
import Play from "../../../assets/NowPlayingBar/Play";
import Pause from "../../../assets/NowPlayingBar/Pause";
import { millisToMinutesAndSeconds, formatDate } from "../../../utils";
import style from "./SongItemMini.module.css";


export const SongItemMini = ({
  song,
  artists,
  index,
  songClicked,
  current,
}) => {

  console.log("song is")
  console.log(song)
  
  console.log("artists is")
  console.log(artists)

  return (
    <React.Fragment>
      {song && (
        <div
          className={[
            style.Item,
            (song.url_path || song.preview_url) ? style.Enabled : style.Disabled,
          ].join(" ")}
          onClick={songClicked}
        >

          <div className={style.Title}>
            <div className={style.ImageContainer}>
                <img src={song.album_image_url} alt="cover img"/>
                <button>
                    {current ? <Pause/> : <Play/>} 
                </button>
            </div>
            <div className={style.NameContainer}>
              <div
                className={style.Name}
                style={current ? { color: "#1db954" } : { color: "white" }}
              >
                <span>{song.name}</span>
              </div>
              {song.explicit && (
                <span className={style.Explicit}>e</span>
              )}
              <span
                className={[
                  style.Artist,
                  song.explicit ? style.Artist_sub : style.Artist_badg,
                ].join(", ")}
              >
                {artists[0].name}
              </span>
            </div>
          </div>
          <div className={style.Length}>
            {millisToMinutesAndSeconds(song.duration_ms)}
            <button className={style.More}>...</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};