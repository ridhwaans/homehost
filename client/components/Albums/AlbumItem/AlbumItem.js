import React from 'react';
import { Link } from 'react-router-dom';

import Play from '../../../assets/NowPlayingBar/Play';
import style from './AlbumItem.module.css';

const AlbumItem = (props) => {
  var album = props.album;
  return (
    <Link to={'/music/album/' + album.id} className={style.LinkAlbum}>
      <div className={style.Album}>
        <div className={style.imgContainer}>
          <img src={album.image_url} alt="Tokyo" />
          <div className={style.PlayContainer}>
            <button className={style.PlayButton} title="Play">
              <Play />
            </button>
          </div>
        </div>
        <div className={style.Name}>{album.name}</div>
        <div className={style.Artist}>{album.artists[0].name}</div>
      </div>
    </Link>
  );
};
export default AlbumItem;
