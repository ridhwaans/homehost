import React from 'react';
import { Link } from 'react-router-dom';

import style from './ListItem.module.css';

const ListItem = ({ album }) => {
  return (
    <Link to={`/music/album/${album.id}`} className={style.ListItem}>
      <li className={style.Item}>
        <span className={style.Title}>{album.name}</span>
      </li>
    </Link>
  );
};
export default ListItem;
