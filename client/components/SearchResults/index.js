import React, { useEffect, useRef } from 'react';

import useSlider from '../../hooks/useSlide';
import useWindowWidth from '../../hooks/useWindowWidth';
import SearchResultsItem from '../SearchResultsItem';
import SearchResultsSelectedItem from '../SearchResultsSelectedItem';
import SliderContext from './context';

function SearchResults({ mainTitle, data, poster }) {
  const width = useWindowWidth();
  const ref = useRef(null);

  const {
    selectSlide,
    closeInformationWindow,
    scaleTiles,
    resetSize,
    slideProps,
    content,
    currentSlide,
    additionalMovieInfo,
  } = useSlider(width, ref, data.length, data, poster);

  const contextValue = {
    currentSlide,
  };

  useEffect(() => {}, [width]);

  const preSelectSlide = (type, title) => {
    const searchResultsSelectedItem = document.getElementById(
      'search-results-selected-item'
    );
    const searchResultsContent = document.getElementById(
      'search-results-content'
    );
    const root = document.getElementById('root');
    const node = document.getElementById(title);

    root.insertBefore(searchResultsSelectedItem, root.childNodes[0]);
    const colCount = window
      .getComputedStyle(searchResultsContent)
      .getPropertyValue('grid-template-columns')
      .split(' ').length;
    const index = Array.prototype.indexOf.call(
      searchResultsContent.childNodes,
      node
    );
    const colPosition = index % colCount;
    const rowPosition = Math.floor((index - colPosition) / colCount);
    const insertPosition = (rowPosition + 1) * colCount;
    console.log(
      `colCount is ${colCount}, index is ${index}, position is row ${rowPosition} column ${colPosition}, insertposition is ${insertPosition}`
    );
    searchResultsContent.insertBefore(
      searchResultsSelectedItem,
      searchResultsContent.children[insertPosition]
    ); //node.parentNode

    searchResultsSelectedItem.style.gridColumn = `span ${colCount}`;
    searchResultsSelectedItem.style.display = `block`;
    searchResultsSelectedItem.style.width = `100vw`;
    searchResultsSelectedItem.style.marginLeft = `calc(50% - 50vw)`;
    selectSlide(type, title);
  };

  return (
    <SliderContext.Provider value={contextValue}>
      <div className="sliderBox">
        <h2 className="slider-header">
          <a>
            <div>{mainTitle}</div>
          </a>
        </h2>
        <div className="slider-container">
          <div className="slider">
            <div className="sliderMask showPeek">
              <div
                id="search-results-content"
                className={`search-results-content ${
                  currentSlide ? 'open' : ''
                }`}
                ref={ref}
                {...slideProps}
              >
                {content.map((item) => {
                  return (
                    <SearchResultsItem
                      key={item.id}
                      title={item.id}
                      data={item}
                      hover={scaleTiles}
                      reset={resetSize}
                      transform={item.transform}
                      origin={item.origin}
                      onSelectSlide={preSelectSlide}
                      poster={false}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <SearchResultsSelectedItem
          currentSlide={currentSlide}
          additionalMovieInfo={additionalMovieInfo}
          closeInformationWindow={closeInformationWindow}
        />
      </div>
    </SliderContext.Provider>
  );
}

export default SearchResults;
