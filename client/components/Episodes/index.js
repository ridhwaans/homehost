import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

import { useGlobalContext } from '../../contexts/context';
import SeasonSelect from './SeasonSelect';

const Episodes = ({ currentSlide, noEpisodesTab }) => {
  const { setMoviesAndTVPlayerState } = useGlobalContext();
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [showOverlay, setShowOverlay] = useState(null);

  const changeSeason = (num) => {
    setSeasonNumber(num);
  };

  const onHover = (index) => {
    setShowOverlay(index);
  };

  const onHoverLeave = () => {
    setShowOverlay(null);
  };

  if (currentSlide && currentSlide.type === 'Movie') {
    noEpisodesTab();
  }

  return (
    currentSlide &&
    currentSlide.type === 'Show' && (
      <div className="menu-episodes">
        <SeasonSelect items={currentSlide.seasons} onChange={changeSeason} />
        <div className="menu-episode-content">
          {currentSlide.seasons
            .find((season) => season.season_number === seasonNumber)
            .episodes.map((episode, index) => {
              return (
                <div className="episode-item" key={index}>
                  <div
                    className="episode-item-image"
                    onMouseLeave={() => onHoverLeave()}
                    onMouseEnter={() => onHover(index)}
                  >
                    {showOverlay === index && (
                      <div className="episode-item-image-overlay">
                        <span>
                          <FontAwesomeIcon icon={faPlayCircle} />
                        </span>
                      </div>
                    )}
                    <img
                      onClick={() =>
                        setMoviesAndTVPlayerState({
                          data: currentSlide,
                          season_number: seasonNumber,
                          episode_number: index + 1,
                        })
                      }
                      src={`${process.env.REACT_APP_IMAGE_BASE}w500_and_h282_face/${episode.still_path}`}
                      alt={'item'}
                    />
                  </div>
                  <div className="episode-item-metada">
                    <span className="episode-item-title">{episode.name}</span>
                    <br />
                    <span className="release-date">{episode.air_date}</span>
                  </div>
                  <div className="episode-item-synopsis">
                    {episode.overview}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )
  );
};

export default Episodes;
