import { faBell, faGift, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';

import logo from '../../assets/logos/Homehost_White.svg';
import { useGlobalContext } from '../../contexts/context';

function Header() {
  const { moviesAndTVSearchInput, setMoviesAndTVSearchInput } =
    useGlobalContext();

  const [pinHeader, setHeader] = useState(false);
  const [searchBox, setSearchBox] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef(null);

  const handleScroll = () => {
    if (window.scrollY === 0) {
      setHeader(false);
    } else if (ref && ref.current && ref.current.getBoundingClientRect()) {
      setHeader(ref.current.getBoundingClientRect().top <= 0);
    }
  };

  const toggleSearchBox = () => {
    if (!searchBox && inputRef.current) inputRef.current.focus();

    setSearchBox((prevState) => !prevState);
  };

  useEffect(() => {
    var li = document.getElementsByClassName('header-list-item');
    for (var el of li) {
      el.firstElementChild.addEventListener('click', (e) =>
        e.target.classList.toggle('active')
      );
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  return (
    <div className="header-height-pinned">
      <div className={`header ${pinHeader ? 'pin-header' : ''}`} ref={ref}>
        <div className="logo">
          <img src={logo} alt={'logo'} />
        </div>

        <div className="header-menu">
          <ul className="header-list">
            <li className="header-list-item menu-trigger">
              <a href={'/'} className="navigation-menu active">
                Menu
              </a>
              <div className="submenu">
                <div className="arrow"></div>
                <div className="topbar"></div>
                <ul>
                  <li>
                    <a href={'/'} className="active">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href={'/movies'}>Movies</a>
                  </li>
                  <li>
                    <a href={'/tv'}>TV Shows</a>
                  </li>
                  <li>
                    <a href={'/music'}>Music</a>
                  </li>
                  <li>
                    <a href={'/podcasts'}>Podcasts</a>
                  </li>
                  <li>
                    <a href={'/books'}>Books</a>
                  </li>
                  <li>
                    <a href={'/comics'}>Comics</a>
                  </li>
                  <li>
                    <a href={'/recently_added'}>Recently Added</a>
                  </li>
                  <li>
                    <a href={'/my_list'}>My List</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="header-list-item">
              <a href={'/'} className="active">
                Home
              </a>
            </li>
            <li className="header-list-item">
              <a href={'/movies'}>Movies</a>
            </li>
            <li className="header-list-item">
              <a href={'/tv'}>TV Shows</a>
            </li>
            <li className="header-list-item">
              <a href={'/music'}>Music</a>
            </li>
            <li className="header-list-item">
              <a href={'/podcasts'}>Podcasts</a>
            </li>
            <li className="header-list-item">
              <a href={'/books'}>Books</a>
            </li>
            <li className="header-list-item">
              <a href={'/comics'}>Comics</a>
            </li>
            <li className="header-list-item">
              <a href={'/recently_added'}>Recently Added</a>
            </li>
            <li className="header-list-item">
              <a href={'/my_list'}>My List</a>
            </li>
          </ul>
        </div>

        <div className="header-options">
          <div className={`${searchBox ? 'searchBox' : 'searchIcon'}`}>
            <span className="icon" onClick={() => toggleSearchBox()}>
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              className="searchInput"
              ref={inputRef}
              value={moviesAndTVSearchInput}
              onChange={(e) => setMoviesAndTVSearchInput(e.currentTarget.value)}
              onBlur={() => setSearchBox(false)}
              type="text"
              placeholder="Titles, People, Genres..."
              maxLength="80"
            />
          </div>
          <div>
            <span className="icon">
              <FontAwesomeIcon icon={faGift} />
            </span>
          </div>
          <div>
            <span className="icon">
              <FontAwesomeIcon icon={faBell} />
            </span>
          </div>
          <div className="account-menu">
            <div className="account-dropdown-menu">
              <span className="presentation">
                <img
                  src={
                    'https://occ-0-2692-360.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABWyw3UeUMaPP3aLxzskg3Bn5htGHqQymxiEGTbfM91FZ0zJAPoEfYQdvHW7FV06FcdXhPC_4F7zNR7TFKLLv6yo.png?r=88c'
                  }
                  alt={'avatar'}
                />
              </span>
              <span className="caret"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
