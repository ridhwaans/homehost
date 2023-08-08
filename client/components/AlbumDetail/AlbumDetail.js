import { FastAverageColor } from 'fast-average-color';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import Time from '../../assets/AlbumDetail/Time';
import { useGlobalContext } from '../../contexts/context';
import { findTotalDurationMillis, millisToEnglishWords } from '../../utils';
import style from './AlbumDetail.module.css';
import { DiscHeader } from './DiscHeader/DiscHeader';
import { SongItem } from './SongItem/SongItem';

const AlbumDetail = () => {
  const { id } = useParams();
  const coverRef = useRef(null);
  const { data: album } = useSWR(`/music/albums/${id}`);
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
  }, [album]);

  const discOne =
    album &&
    album.songs &&
    album.songs.filter((item) => item.disc_number === 1);
  const discTwo =
    album &&
    album.songs &&
    album.songs.filter((item) => item.disc_number === 2);

  return (
    <React.Fragment>
      {album && album.songs && (
        <div className={style.AlbumDetail}>
          <div className={style.Cover}>
            <div className={style.Background} id="Background"></div>
            <div className={style.Gradient}></div>
            <div className={style.Img}>
              <img src={album.image_url} alt="album img" ref={coverRef} />
            </div>
            <div className={style.Infos}>
              <div className={style.Album}>
                {album.album_type.toUpperCase()}
              </div>
              <div className={style.Title}>
                <h1>{album.name}</h1>
              </div>
              <div className={style.Categ}>{album.description}</div>
              <div className={style.Details}>
                <span className={style.Text_Bold}>{album.artists[0].name}</span>
                <span className={style.Text_Light}>
                  {parseInt(album.release_date)}
                </span>
                <span className={style.Text_Light}>
                  {`${
                    album.songs.filter((item) => item.url_path != null).length
                  } songs out of ${album.total_tracks} total, 
                    ${millisToEnglishWords(
                      findTotalDurationMillis(album.songs)
                    )}`}
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
                <div></div>
                <div></div>
                <div className={style.Length}>
                  <Time />
                </div>
              </div>
            </div>

            {discOne.length > 0 && discTwo.length > 0 && (
              <DiscHeader number={1} />
            )}
            {discOne.map((item) => (
              <SongItem
                key={item.id}
                song={item}
                current={
                  playerState.currentSong &&
                  item.id === playerState.currentSong.id
                    ? true
                    : false
                }
                songClicked={() => changeSong(item.id, album.songs)}
              />
            ))}

            {discTwo.length > 0 && <DiscHeader number={2} />}
            {discTwo.map((item) => (
              <SongItem
                key={item.id}
                song={item}
                current={
                  playerState.currentSong &&
                  item.id === playerState.currentSong.id
                    ? true
                    : false
                }
                songClicked={() => changeSong(item.id, album.songs)}
              />
            ))}
          </div>
          <div className={style.List_Footer}>
            <p>
              © {parseInt(album.release_date)} {album.label}{' '}
            </p>
            <p>
              ℗ {parseInt(album.release_date)} {album.label}{' '}
            </p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default AlbumDetail;
