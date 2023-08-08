import React from 'react';

import NowPlaying from '../../../assets/AlbumDetail/NowPlaying.gif';
import Pause from '../../../assets/NowPlayingBar/Pause';
import Play from '../../../assets/NowPlayingBar/Play';
import { formatDate, millisToMinutesAndSeconds } from '../../../utils';
import style from '../../AlbumDetail/SongItem/SongItem.module.css';

export const SongItem = ({ song, songClicked, current, index }) => {
  return (
    <React.Fragment>
      {song && (
        <div
          className={[
            style.Item,
            song.url_path || song.preview_url ? style.Enabled : style.Disabled,
          ].join(' ')}
          onClick={songClicked}
        >
          <div className={style.Index}>
            <span style={current ? { color: '#1db954' } : { color: 'white' }}>
              {current ? <img src={NowPlaying} alt="nowPlaying" /> : index + 1}
            </span>
            <button>{current ? <Pause /> : <Play />}</button>
          </div>

          <div className={style.Title}>
            <img src={song.album_image_url} alt="cover img" />
            <div className={style.NameContainer}>
              <div
                className={style.Name}
                style={current ? { color: '#1db954' } : { color: 'white' }}
              >
                <span>{song.name}</span>
              </div>
              {song.explicit && <span className={style.Explicit}>e</span>}
              <span
                className={[
                  style.Artist,
                  song.explicit ? style.Artist_sub : style.Artist_badg,
                ].join(', ')}
              >
                {song.artists.map((a) => a.name).join(', ')}
              </span>
            </div>
          </div>
          <div>{song.album_name}</div>
          <div>{formatDate(song.mtime)}</div>
          <div className={style.Length}>
            {millisToMinutesAndSeconds(song.duration_ms)}
            <button className={style.More}>...</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
