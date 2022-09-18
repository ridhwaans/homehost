import React from 'react';

import Disc from '../../../assets/AlbumDetail/Disc';
import style from './DiscHeader.module.css';

export const DiscHeader = ({ number }) => {
  return (
    <React.Fragment>
      {
        <div className={[style.Item, style.Enabled].join(' ')}>
          <div className={style.Index}>
            <span style={{ color: 'white' }}>
              <Disc />
            </span>
          </div>

          <div className={style.Title}>
            <div className={style.NameContainer}>
              <div className={style.Name}>
                <span>{`Disc ${number}`}</span>
              </div>
            </div>
          </div>
          <div></div>
          <div></div>
          <div className={style.Length}>
            {}
            <button className={style.More}>...</button>
          </div>
        </div>
      }
    </React.Fragment>
  );
};
