import React from 'react';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';

import AlbumItem from './AlbumItem/AlbumItem';
import style from './Albums.module.css';

const Albums = () => {
  const location = useLocation();
  const { data: fetchedData } = useSWR(
    location.state?.data ? null : '/music/albums'
  );
  const data = location.state?.data ?? fetchedData;

  return (
    <React.Fragment>
      <div className={style.Albums}>
        <h1 className={style.Title}>Albums</h1>

        <div className={style.Container}>
          {data &&
            data.map((item) => {
              return <AlbumItem key={item.id} album={item} />;
            })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Albums;
