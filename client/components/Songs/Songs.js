import { FastAverageColor } from 'fast-average-color';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import Time from '../../assets/AlbumDetail/Time';
import { useGlobalContext } from '../../contexts/context';
import { SongItem } from './SongItem/SongItem';
import style from './Songs.module.css';

const Songs = () => {
  const location = useLocation();
  const { data } = location.state;
  const coverRef = useRef(null);
  const { playerState, changeSong } = useGlobalContext();

  useEffect(() => {
    if (coverRef.current) {
      coverRef.current.crossOrigin = 'Anonymous';
      const fac = new FastAverageColor();
      fac
        .getColorAsync(coverRef.current)
        .then((color) => {
          if (document.getElementById('Background')) {
            document.getElementById('Background').style.backgroundColor =
              color.rgb;
          }
          if (document.getElementById('AlbumBackground')) {
            document.getElementById('AlbumBackground').style.backgroundColor =
              color.rgb;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  return (
    <React.Fragment>
      {data && (
        <div className={style.AlbumDetail}>
          <div className={style.Cover}>
            <div className={style.Background} id="Background"></div>
            <div className={style.Gradient}></div>
            <div className={style.Img}>
              <img
                src="http://i.imgur.com/bVnx0IY.png"
                alt="album img"
                ref={coverRef}
              />
            </div>
            <div className={style.Infos}>
              <div className={style.Album}>COMPILATION</div>
              <div className={style.Title}>
                <h1>Songs</h1>
              </div>
              <div className={style.Categ}>Various categories</div>
              <div className={style.Details}>
                <span className={style.Text_Bold}>Various Artists</span>
                <span className={style.Text_Light}>NaN</span>
                <span className={style.Text_Light}>
                  {`${data.length} songs`}
                </span>
              </div>
            </div>
          </div>

          <div className={style.List_Background} id="AlbumBackground" />
          <div className={style.List}>
            <div className={style.Heading_Sticky}>
              <div className={style.Heading}>
                <div>#</div>
                <div>Title</div>
                <div>Album</div>
                <div>Date added</div>
                <div className={style.Length}>
                  <Time />
                </div>
              </div>
            </div>

            {data.map((item, index) => (
              <SongItem
                key={item.id}
                song={item}
                current={
                  playerState.currentSong &&
                  item.id === playerState.currentSong.id
                    ? true
                    : false
                }
                songClicked={() => changeSong(item.id, data)}
                index={index}
              />
            ))}
          </div>
          <div className={style.List_Footer}>
            <p>© Various Labels </p>
            <p>℗ Various Labels </p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Songs;
