import { faImdb } from '@fortawesome/free-brands-svg-icons';
import { faPlay, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

import { useGlobalContext } from '../../contexts/context';
import Details from '../Details';
import Episodes from '../Episodes';
import Similar from '../Similar';

const SelectedItem = ({ currentSlide, closeInformationWindow }) => {
  const [menuOption, setMenuOption] = useState('general-info');
  const { setMoviesAndTVPlayerState } = useGlobalContext();

  return (
    <div className="additional-information">
      <div
        className={`ai-background ${
          menuOption !== 'general-info' ? 'dim' : null
        }`}
      >
        <div className={`ai-background-shadow`} />
        <div
          className="ai-background-image"
          style={{
            backgroundImage: `url(${process.env.REACT_APP_IMAGE_BASE}original/${currentSlide.backdrop_path})`,
          }}
        />

        <div className="ai-background-nav-shadow"></div>
      </div>

      {currentSlide ? (
        <React.Fragment>
          <div className="ai-content-area">
            <div className="ai-content-area-container">
              {currentSlide.logo_path ? (
                <div
                  className="ai-content-area-banner-logo"
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_IMAGE_BASE}w500/${currentSlide.logo_path})`,
                  }}
                  alt="boxart"
                />
              ) : (
                <h3>
                  <div>
                    {currentSlide.type === 'Movie'
                      ? currentSlide.title
                      : currentSlide.name}
                  </div>
                </h3>
              )}

              {menuOption === 'general-info' ? (
                <div className="jaw-bone-common">
                  <div className="metadata">
                    <span className="imdb">
                      <a
                        href={`${process.env.REACT_APP_IMDB_BASE}/title/${
                          currentSlide.type === 'Movie'
                            ? currentSlide.imdb_id
                            : currentSlide.imdb_id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FontAwesomeIcon icon={faImdb} />
                      </a>
                    </span>
                    <span className="score">{currentSlide.vote_average}</span>
                    <span className="year">{currentSlide.release_date}</span>
                    <span className="duration">
                      {currentSlide.type === 'Movie'
                        ? `${currentSlide.runtime}m`
                        : `${currentSlide.seasons.length} Season${
                            currentSlide.seasons.length > 1 ? `s` : ``
                          }`}
                    </span>
                  </div>

                  <div className="synopsis">{currentSlide.overview}</div>

                  <div className="actions">
                    <div className="play-link">
                      <button
                        className="hasLabel"
                        onClick={() => {
                          currentSlide.type === 'Movie'
                            ? setMoviesAndTVPlayerState(currentSlide)
                            : setMoviesAndTVPlayerState({
                                data: currentSlide,
                                season_number:
                                  currentSlide.seasons[0].season_number,
                                episode_number:
                                  currentSlide.seasons[0].episodes[0]
                                    .episode_number,
                              });
                        }}
                      >
                        <span className="play-icon">
                          <FontAwesomeIcon icon={faPlay} />
                        </span>
                        <span>Play</span>
                      </button>
                    </div>

                    <button className="hasLabel play-link-secondary">
                      <span className="play-icon">
                        <FontAwesomeIcon icon={faPlus} />
                      </span>
                      <span>My List</span>
                    </button>
                  </div>

                  <div className="meta-lists">
                    <p className="inline-list">
                      <span>Featuring:</span>
                      {currentSlide.credits.cast.map((person, index) => {
                        if (index < 6) return person.name + ' ';
                        return null;
                      })}
                    </p>
                    <p className="inline-list">
                      <span>Genres:</span>
                      {currentSlide.genres.map((genre, index) => {
                        if (index < 6) return genre.name + ' ';
                        return null;
                      })}
                    </p>
                  </div>
                </div>
              ) : menuOption === 'episodes' ? (
                <Episodes currentSlide={currentSlide} />
              ) : menuOption === 'similar' ? (
                <Similar currentSlide={currentSlide} />
              ) : menuOption === 'details' ? (
                <Details currentSlide={currentSlide} />
              ) : null}

              <ul className="menu">
                <li
                  className={`${menuOption === 'general-info' && 'current'}`}
                  onClick={() => setMenuOption('general-info')}
                >
                  <div className="menu-button">GENERAL INFORMATION</div>
                  <span></span>
                </li>
                {currentSlide.type === 'Show' ? (
                  <li
                    className={`${menuOption === 'episodes' && 'current'}`}
                    onClick={() => setMenuOption('episodes')}
                  >
                    <div className="menu-button">EPISODES</div>
                    <span></span>
                  </li>
                ) : (
                  <React.Fragment />
                )}
                <li
                  className={`${menuOption === 'similar' && 'current'}`}
                  onClick={() => setMenuOption('similar')}
                >
                  <div className="menu-button">SIMILAR</div>
                  <span></span>
                </li>
                <li
                  className={`${menuOption === 'details' && 'current'}`}
                  onClick={() => setMenuOption('details')}
                >
                  <div className="menu-button">DETAILS</div>
                  <span></span>
                </li>
              </ul>
            </div>

            <button
              className="ai-close-button"
              onClick={() => closeInformationWindow()}
            >
              <span>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </button>
          </div>
        </React.Fragment>
      ) : (
        <div className="ai-content-area">
          <h2>Loading...</h2>
        </div>
      )}
    </div>
  );
};

export default SelectedItem;
