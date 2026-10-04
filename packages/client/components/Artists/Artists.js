import React from 'react';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';

import ArtistItem from './ArtistItem/ArtistItem';
import style from './Artists.module.css';

const Artists = () => {
  const location = useLocation();
  const { data: fetchedData } = useSWR(
    location.state?.data ? null : '/music/artists'
  );
  const data = location.state?.data ?? fetchedData;

  return (
    <React.Fragment>
      <div className={style.Albums}>
        <h1 className={style.Title}>Artists</h1>

        <div className={style.Container}>
          {data &&
            data.map((item) => {
              return <ArtistItem key={item.id} artist={item} />;
            })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Artists;
