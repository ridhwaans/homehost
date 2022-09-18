import React from 'react';
import useSWR from 'swr';

import MusicRow from '../MusicRow/MusicRow';
import style from './MusicHome.module.css';

const MusicHome = () => {
  const albums = useSWR('/music/albums/latest');
  const artists = useSWR('/music/artists/most_popular');
  const songs = useSWR('/music/songs/recently_added');

  return (
    <React.Fragment>
      <div className={style.MusicHome}>
        <MusicRow
          mainTitle={'Recently Added Songs'}
          data={songs.data}
          musicType={'songs'}
        />
        <MusicRow
          mainTitle={'Latest Album Releases'}
          data={albums.data}
          musicType={'albums'}
        />
        <MusicRow
          mainTitle={'Top Artists'}
          data={artists.data}
          musicType={'artists'}
        />
      </div>
    </React.Fragment>
  );
};
export default MusicHome;
