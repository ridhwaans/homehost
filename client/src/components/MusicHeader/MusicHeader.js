import {
  faChevronLeft,
  faChevronRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../../contexts/context';
import style from './MusicHeader.module.css';

const MusicHeader = ({ account }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputRef = useRef(null);

  const { musicSearchInput, setMusicSearchInput } = useGlobalContext();

  return (
    <div className={style.Header}>
      <div className={style.BackForward}>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className={style.Icon}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={() => {
            navigate(1);
          }}
          className={style.Icon}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      {location.pathname.startsWith('/music/search') && (
        <div className={style.SearchBar}>
          <span className={style.Icon}>
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            placeholder="Search for Artists, Songs, or Podcasts"
            type="text"
            ref={inputRef}
            value={musicSearchInput}
            onChange={(e) => setMusicSearchInput(e.currentTarget.value)}
          />
        </div>
      )}
      <div className={style.HeaderRight}>
        <img
          alt="Avatar"
          src={
            'https://occ-0-2692-360.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABWyw3UeUMaPP3aLxzskg3Bn5htGHqQymxiEGTbfM91FZ0zJAPoEfYQdvHW7FV06FcdXhPC_4F7zNR7TFKLLv6yo.png?r=88c'
          }
        />
        <h4>{account.display_name}</h4>
      </div>
    </div>
  );
};

export default MusicHeader;
