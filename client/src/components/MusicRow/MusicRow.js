import React from 'react';
import { Link } from 'react-router-dom';

import { useGlobalContext } from '../../contexts/context';
import AlbumItem from '../Albums/AlbumItem/AlbumItem';
import ArtistItem from '../Artists/ArtistItem/ArtistItem';
import { SongItemMini } from '../Songs/SongItemMini/SongItemMini';
import style from './MusicRow.module.css';

const MusicRow = ({ mainTitle, data, musicType }) => {
  const { playerState, changeSong } = useGlobalContext();

  return (
    <React.Fragment>
      <div className={style.MusicRow}>
        <div className={style.RowHeader}>
          <span className={style.Title}>{mainTitle}</span>
          <Link
            style={{ textDecoration: 'none', color: 'white' }}
            to={{ pathname: `/music/${musicType}` }}
            state={{ data: data }}
          >
            <span>SEE ALL</span>
          </Link>
        </div>

        {(musicType === 'albums' || musicType === 'artists') && (
          <div className={style.Container}>
            {musicType === 'albums' &&
              data &&
              data.map((item) => {
                return <AlbumItem key={item.id} album={item} />;
              })}
            {musicType === 'artists' &&
              data &&
              data.map((item) => {
                return <ArtistItem key={item.id} artist={item} />;
              })}
          </div>
        )}

        {musicType === 'songs' && (
          <div className={style.SongItemsContainer}>
            {data &&
              data.map((item) => {
                return (
                  <SongItemMini
                    key={item.id}
                    song={item}
                    current={
                      playerState?.currentSong &&
                      item.id === playerState.currentSong.id
                        ? true
                        : false
                    }
                    songClicked={() => changeSong(item.id, data)}
                  />
                );
              })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default MusicRow;
