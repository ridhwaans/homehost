import { faPlay, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useSWR from 'swr';

import { useGlobalContext } from '../../contexts/context';

function BigBillboard() {
  const { data: item } = useSWR(`/watch/billboard`);

  const { setMoviesAndTVPlayerState } = useGlobalContext();

  return (
    item && (
      <div className="billboard-content-limits">
        <div className="billboard-base">
          <div className="billboard-image-wrapper">
            <img
              src={`${process.env.REACT_APP_IMAGE_BASE}original/${item.backdrop_path}`}
              alt={'hero'}
            />

            <div className="billboard-vignette"></div>
            <div className="billboard-vignette-bottom"></div>
            <div className="billboard-maturity-rating">
              <span>+13</span>
            </div>
          </div>

          <div className="billboard-information">
            <div className="logo-and-text">
              {item.logo_path ? (
                <img
                  className="logo"
                  src={`${process.env.REACT_APP_IMAGE_BASE}w500/${item.logo_path}`}
                  alt="boxart"
                />
              ) : (
                <div className="billboard-title">
                  <h3>
                    <div>{item.type === 'Movie' ? item.title : item.name} </div>
                  </h3>
                </div>
              )}

              <div className="billboard-description">
                <div className="episode-title-container"></div>
                <div className="synopsis">{item && item.overview}</div>
              </div>

              <div className="billboard-link">
                <a className="play-link">
                  <button
                    className="hasLabel"
                    onClick={() => {
                      item.type === 'Movie'
                        ? setMoviesAndTVPlayerState(item)
                        : setMoviesAndTVPlayerState({
                            data: item,
                            season_number: item.seasons[0].season_number,
                            episode_number:
                              item.seasons[0].episodes[0].episode_number,
                          });
                    }}
                  >
                    <span className="play-icon">
                      <FontAwesomeIcon icon={faPlay} />
                    </span>
                    <span>Play</span>
                  </button>
                </a>

                <button className="hasLabel play-link-secondary">
                  <span className="play-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </span>
                  <span>Information</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default BigBillboard;
