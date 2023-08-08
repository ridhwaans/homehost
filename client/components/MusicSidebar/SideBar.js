import {
  faBook,
  faFilm,
  faFolderPlus,
  faHome,
  faList,
  faMusic,
  faPodcast,
  faSearch,
  faTv,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/logos/Homehost_White.svg';
import ListItem from './ListItem/ListItem';
import style from './SideBar.module.css';
import SidebarOption from './SidebarOption/SidebarOption';

const SideBar = ({ albums }) => {
  return (
    <div className={style.SideBar}>
      <Link style={{ textDecoration: 'none', color: 'white' }} to="/music">
        <div className={style.Logo}>
          <img src={logo} alt="Tokyo"></img>
        </div>
      </Link>

      <Link style={{ textDecoration: 'none', color: 'white' }} to="/music">
        <SidebarOption Icon={faHome} option="Home" />
      </Link>

      <Link
        style={{ textDecoration: 'none', color: 'white' }}
        to="/music/search/"
      >
        <SidebarOption Icon={faSearch} option="Search" />
      </Link>

      <Link style={{ textDecoration: 'none', color: 'white' }} to="/music">
        <SidebarOption Icon={faMusic} option="Music" />
      </Link>

      <a style={{ textDecoration: 'none', color: 'white' }} href="/podcasts">
        <SidebarOption Icon={faPodcast} option="Podcasts" />
      </a>

      <a style={{ textDecoration: 'none', color: 'white' }} href="/movies">
        <SidebarOption Icon={faFilm} option="Movies" />
      </a>

      <a style={{ textDecoration: 'none', color: 'white' }} href="/tv">
        <SidebarOption Icon={faTv} option="TV Shows" />
      </a>

      <a style={{ textDecoration: 'none', color: 'white' }} href="/books">
        <SidebarOption Icon={faBook} option="Books" />
      </a>

      <a style={{ textDecoration: 'none', color: 'white' }} href="/comics">
        <SidebarOption Icon={faBook} option="Comics" />
      </a>

      <a
        style={{ textDecoration: 'none', color: 'white' }}
        href="/recently_added"
      >
        <SidebarOption Icon={faFolderPlus} option="Recently Added" />
      </a>

      <a style={{ textDecoration: 'none', color: 'white' }} href="/my_list">
        <SidebarOption Icon={faList} option="My List" />
      </a>

      <h1 className={style.Title}>Playlists</h1>

      <hr className={style.Separator} />

      <div className={style.ListContainer}>
        <ul className={style.List}>
          {albums &&
            albums.map((item) => {
              return <ListItem album={item} key={item.id} />;
            })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
