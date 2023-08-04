import React from 'react';
import { Link } from 'react-router-dom';

import Play from '../../../assets/NowPlayingBar/Play';
import style from './ArtistItem.module.css';

const ArtistItem = (props) => {
  var artist = props.artist;
  // some spotify artist image urls are broken, try onError
  return (
    <Link to={'/music/artist/' + artist.id} className={style.LinkAlbum}>
      <div className={style.Album}>
        <div className={style.imgContainer}>
          <img src={artist.image_url} alt={'Tokyo'} />
          <div className={style.PlayContainer}>
            <button className={style.PlayButton} title="Play">
              <Play />
            </button>
          </div>
        </div>
        <div className={style.Name}>{artist.name}</div>
        <div className={style.Artist}>Artist</div>
      </div>
    </Link>
  );
};
export default ArtistItem;
