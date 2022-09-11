import React, { useContext, useState, useRef, useEffect } from 'react';
import { externalSearch } from '../../api';
import { useDebounce } from '../../hooks/useDebounce';
import AppContext from './Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFileVideo,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const FormThree = () => {
  const [searchBox, setSearchBox] = useState(false);
  const inputRef = useRef(null);
  const [searchInput, updateSearchInput] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const dInput = useDebounce(searchInput, 1000);

  const myContext = useContext(AppContext);
  const updateContext = myContext.fileDetails;

  const toggleSearchBox = () => {
    if (!searchBox && inputRef.current) inputRef.current.focus();
    setSearchBox((prevState) => !prevState);
  };

  const fetchSearchResults = async (type, text) => {
    let searchResults;
    if (type === 'Movie') {
      searchResults = await externalSearch(type, text);
    } else if (type === 'Song') {
      searchResults = await externalSearch(type, text);
    }
    return { searchResults };
  };

  useEffect(() => {
    if (!updateContext.selectedFile || (dInput && dInput.trim().length === 0))
      return;
    console.log(`type: ${updateContext.selectedFile.type}, search: ${dInput}`);
    fetchSearchResults(updateContext.selectedFile.type, dInput).then(
      (response) => {
        setSearchResults(response.searchResults);
      }
    );
    return () => {
      setSearchResults(null);
    };
  }, [dInput]);

  const next = () => {
    updateContext.setStep(updateContext.currentPage + 1);
  };
  const previous = () => {
    updateContext.setStep(updateContext.currentPage - 1);
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
        Find the {updateContext.selectedFile.type}
        <b>{updateContext.selectedFile.fs_path}</b>
      </p>
      <div className="formContain">
        <form className="form">
          {updateContext.selectedFile && (
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
              {updateContext.selectedFile.type === 'Movie' &&
                searchResults &&
                searchResults.results.map((item) => (
                  <div className="search-result-item">
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
              {updateContext.selectedFile.type === 'Song' && unknownAlbum}
              {updateContext.selectedFile.type === 'Song' &&
                searchResults &&
                searchResults.tracks.items.map((item) => (
                  <div className="search-result-item">
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
