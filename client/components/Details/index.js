import React from 'react';

const Details = ({ currentSlide }) => {
  const findOnebyType = (name, type, data) => {
    let first = data.find((item) => item.department === type);

    if (first) {
      return (
        <div className="menu-details-item">
          <span className="details-item-title">{name}</span>
          <span>{first.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="menu-details">
      <div className="menu-details-content">
        <div className="menu-details-item">
          <span className="details-item-title">Cast</span>
          {currentSlide.credits.cast.map((item, index) => {
            if (index < 10) {
              return <span key={index}>{item.name}</span>;
            }
            return null;
          })}
        </div>

        {findOnebyType('Directing', 'Directing', currentSlide.credits.crew)}

        {findOnebyType('Editing', 'Editing', currentSlide.credits.crew)}

        {findOnebyType('Sound', 'Sound', currentSlide.credits.crew)}

        <div className="menu-details-item">
          <span className="details-item-title">Genres</span>
          {currentSlide.genres.map((item, index) => {
            return <span key={index}>{item.name}</span>;
          })}
        </div>

        {currentSlide.production_companies[0] && (
          <div className="menu-details-item">
            <span className="details-item-title">Production</span>
            <span>{currentSlide.production_companies[0].name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
