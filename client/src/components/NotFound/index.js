import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faFilm, faTv } from '@fortawesome/free-solid-svg-icons';

import '../../assets/Movies.css';

function NotFound() {
  useEffect(() => {
    document.documentElement.className = 'movies-html-and-body'; //<html>
    document.body.className = 'movies-html-and-body'; //<body>
  }, []);

  return (
    <div className="movies">
      <div
        className="background-app bg"
        style={{
          backgroundImage: `url(${process.env.REACT_APP_IMAGE_BASE}original/ai2FicMUxLCurVkjtYdSvVDWRmS.jpg)`,
        }}
      >
        <div className="not-found-content">
          <h1>Not found</h1>
          <div className="not-found-content-body">
            <p>Sorry, we can't find that page</p>
            <div className="not-found-content-buttons">
              <a className="play-link" href={'/movies'}>
                <button className="hasLabel">
                  <span className="play-icon">
                    <FontAwesomeIcon icon={faFilm} />
                  </span>
                  <span>Movies Home</span>
                </button>
              </a>
              <a className="play-link" href={'/tv'}>
                <button className="hasLabel">
                  <span className="play-icon">
                    <FontAwesomeIcon icon={faTv} />
                  </span>
                  <span>TV Home</span>
                </button>
              </a>
              <a className="play-link" href={'/music'}>
                <button className="hasLabel">
                  <span className="play-icon">
                    <FontAwesomeIcon icon={faMusic} />
                  </span>
                  <span>Music Home</span>
                </button>
              </a>
            </div>
          </div>
        </div>

        <span id="" class="imageSource" data-uia="">
          FROM <strong>WALL·E</strong>
        </span>
      </div>
    </div>
  );
}

export default NotFound;
