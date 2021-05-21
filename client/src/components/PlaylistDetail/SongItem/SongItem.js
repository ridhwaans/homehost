import React from "react";
import Play from "../../../assets/Play";
import { formatDate, millisToMinutesAndSeconds } from "../../../utils";
import styles from "./SongItem.module.css";


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
            styles.Item,
            song.preview_url ? styles.Enabled : styles.Disabled,
          ].join(" ")}
          onClick={songClicked}
        >
          <div className={styles.Index}>
            <span style={current ? { color: "#1db954" } : { color: "white" }}>
              {index + 1}
            </span>
            <button>
              <Play />
            </button>
          </div>

          <div className={styles.Title}>
            
            <div className={styles.NameContainer}>
              <div
                className={styles.Name}
                style={current ? { color: "#1db954" } : { color: "white" }}
              >
                <span>{song.name}</span>
              </div>
              {song.explicit && (
                <span className={styles.Explicit}>e</span>
              )}
              <span
                className={[
                  styles.Artist,
                  song.explicit ? styles.Artist_sub : styles.Artist_badg,
                ].join(", ")}
              >
                {artists[0].name}
              </span>
            </div>
          </div>
          <div></div>
          <div></div>
          <div className={styles.Length}>
            {millisToMinutesAndSeconds(song.duration_ms)}
            <button className={styles.More}>...</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};