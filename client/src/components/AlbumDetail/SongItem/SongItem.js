import React from "react";
import Play from "../../../assets/Play";
import Pause from "../../../assets/Pause";
import { millisToMinutesAndSeconds } from "../../../utils";
import style from "./SongItem.module.css";


export const SongItem = ({
  song,
  artists,
  index,
  songClicked,
  current,
}) => {
  return (
    <React.Fragment>
      {song && (
        <div
          className={[
            style.Item,
            (song.fs_path || song.preview_url) ? style.Enabled : style.Disabled,
          ].join(" ")}
          onClick={songClicked}
        >
          <div className={style.Index}>
            <span style={current ? { color: "#1db954" } : { color: "white" }}>
              {index + 1}
            </span>
            <button>
              {current ? <Pause/> : <Play/>} 
            </button>
          </div>

          <div className={style.Title}>
            
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
          <div></div>
          <div></div>
          <div className={style.Length}>
            {millisToMinutesAndSeconds(song.duration_ms)}
            <button className={style.More}>...</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};