import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import useSWR from 'swr';

import { useGlobalContext } from '../../contexts/context';
import { useDebounce } from '../../hooks/useDebounce';
import './styles.css';

const FormThree = () => {
  const [searchBox, setSearchBox] = useState(false);
  const inputRef = useRef(null);
  const [searchInput, updateSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 1000);
  const { mediaWizard, setMediaWizard } = useGlobalContext();

  const { data: searchResults } = useSWR(
    mediaWizard?.selectedFile?.type !== 'Episode'
      ? `/services/search?type=${mediaWizard.selectedFile.type}&q=${debouncedSearch}`
      : null
  );

  const toggleSearchBox = () => {
    if (!searchBox && inputRef.current) inputRef.current.focus();
    setSearchBox((prevState) => !prevState);
  };

  const next = () => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      currentStep: mediaWizard.currentStep + 1,
    }));
  };

  const previous = () => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      currentStep: mediaWizard.currentStep - 1,
    }));
  };

  const unknownAlbum = (
    <div className="search-result-item">
      <img src={`http://i.imgur.com/bVnx0IY.png`} width="125" height="125" />
      <div>
        <h2>{`Didn't find anything? Add to Unknown Album`}</h2>
        <button onClick={next}>Apply</button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <p>
        Find the {mediaWizard.selectedFile.type}
        <b>{mediaWizard.selectedFile.fs_path}</b>
      </p>
      <div className="formContain">
        <form className="form">
          {mediaWizard.selectedFile && (
            <div className="tabcontent">
              <div className={`${searchBox ? 'searchBox' : 'searchIcon'}`}>
                <span className="icon" onClick={() => toggleSearchBox()}>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  className="searchInput"
                  ref={inputRef}
                  value={searchInput}
                  onChange={(e) => updateSearchInput(e.currentTarget.value)}
                  onBlur={() => setSearchBox(false)}
                  type="text"
                  placeholder="Movies, Episodes, Songs..."
                  maxLength="80"
                />
              </div>
              {mediaWizard.selectedFile.type === 'Movie' &&
                searchResults &&
                searchResults.results.map((item) => (
                  <div key={item.id} className="search-result-item">
                    <img
                      src={`${process.env.REACT_APP_IMAGE_BASE}original/${item.poster_path}`}
                      width="100"
                      height="150"
                    />
                    <div>
                      <h2>{`${item.title} (${
                        item.original_language
                      }, ${parseInt(item.release_date)})`}</h2>
                      <h3>{`TMDB ID: ${item.id}`}</h3>
                      <button onClick={next}>Apply</button>
                    </div>
                  </div>
                ))}
              {mediaWizard.selectedFile.type === 'Song' && unknownAlbum}
              {mediaWizard.selectedFile.type === 'Song' &&
                searchResults &&
                searchResults.tracks.items.map((item) => (
                  <div key={item.id} className="search-result-item">
                    <img
                      src={item.album.images[0].url}
                      width="125"
                      height="125"
                    />
                    <div>
                      <h2>{`${item.disc_number}-${item.track_number} "${item.name}"`}</h2>
                      <h3>{`${item.album.name} (${parseInt(
                        item.album.release_date
                      )})`}</h3>
                      <h4>{`Spotify Album ID: ${item.album.id}`}</h4>
                      <button onClick={next}>Apply</button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <button
            className="formSubmit"
            value="Next"
            type="submit"
            onClick={next}
          >
            Next{' '}
          </button>
          <button
            className="formSubmit"
            value="Previous"
            type="submit"
            onClick={previous}
          >
            Previous{' '}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormThree;
