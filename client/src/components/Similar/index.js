import React from 'react';

const Similar = ({ currentSlide }) => {
  return (
    <div className="menu-similar">
      <div className="menu-similar-content">
        {currentSlide.similar.map((similarMovie, index) => {
          if (index < 4) {
            return (
              <div className="similar-item" key={index}>
                <div className="similar-item-image">
                  <img
                    src={`${process.env.REACT_APP_IMAGE_BASE}original/${similarMovie.backdrop_path}`}
                    alt={'item'}
                  />
                </div>
                <div className="similar-item-metada">
                  <span className="similar-item-title">
                    {currentSlide.type === 'Movie'
                      ? similarMovie.title
                      : similarMovie.name}
                  </span>
                  <br />
                  <span className="release-date">
                    {similarMovie.release_date}
                  </span>
                </div>
                <div className="similar-item-synopsis">
                  {similarMovie.overview}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default Similar;
