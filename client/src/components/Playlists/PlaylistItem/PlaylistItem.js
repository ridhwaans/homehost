import React from "react"
import { Link } from "react-router-dom";
import style from "./PlaylistItem.module.css"
import Play from "../../../assets/Play"

const PlaylistItem = (props) => {
    var playlist = props.playlist;
    return (
      <Link to={"/music/playlist/" + playlist.id} className={style.LinkPlaylist}>
        <div className={style.Playlist}>
          <div className={style.imgContainer}>
            <img src={playlist.images[0].url} alt="Tokyo"/>
            <div className={style.PlayContainer}>
              <button className={style.PlayButton} title="Play">
                <Play />
              </button>
            </div>
          </div>
          <div className={style.Name}>{playlist.name}</div>
          <div className={style.Artist}>{playlist.artists[0].name}</div>
        </div>
      </Link>
    );
};
export default PlaylistItem;
