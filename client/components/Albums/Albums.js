import React from 'react';
import { useLocation } from 'react-router-dom';

import AlbumItem from './AlbumItem/AlbumItem';
import style from './Albums.module.css';

const Albums = () => {
  const location = useLocation();
  //console.log("Albums location is")
  console.log(location);
  const { data } = location.state;

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
