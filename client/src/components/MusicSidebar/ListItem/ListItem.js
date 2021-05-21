import React, { Component }  from 'react';
import { Link } from "react-router-dom";
import style from "./ListItem.module.css"

const ListItem = ({playlist}) => {
    return (
      <Link to={`/music/playlist/${playlist.id}`} className={style.ListItem}>
        <li className={style.Item}>
          <span className={style.Title}>{playlist.name}</span>
        </li>
      </Link>
    );
};
export default ListItem;
