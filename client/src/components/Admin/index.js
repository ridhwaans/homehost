import React, { useEffect, useRef, useState, useContext } from 'react';
import { getAbout, getLibraryStats, getNotAvailable, externalSearch, addMovie, addEpisode, addSong } from "../../api"
import { useDebounce } from "../../hooks/useDebounce"
import AdminHeader from "../AdminHeader"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFileVideo, faFileAudio } from '@fortawesome/free-solid-svg-icons'

const Admin = () => {

  const [about, setAbout] = useState(null)
  const [stats, setStats] = useState(null)
  const [notAvailable, setNotAvailable] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [searchBox, setSearchBox] = useState(false)
  const inputRef = useRef(null)
  const [ searchInput, updateSearchInput ] = useState(null)
  const [ searchResults, setSearchResults ] = useState(null)

  const dInput = useDebounce(searchInput, 1000);

  const fetch = async () => {
    let about = await getAbout()
    let stats = await getLibraryStats()
    let notAvailable = await getNotAvailable()

    return { about, stats, notAvailable }
  }

  useEffect(() => {
    document.documentElement.className = "movies-html-and-body"; //<html>
    document.body.className = "movies-html-and-body"; //<body>

    fetch().then(response => {
      setAbout(response.about)
      setStats(response.stats)
      setNotAvailable(response.notAvailable)
    })
      return () => {
        setAbout(null)
        setStats(null)
        setNotAvailable(null)
      }
  }, [])

  const toggleSearchBox = () => {
    if (!searchBox && inputRef.current) inputRef.current.focus();
    setSearchBox(prevState => !prevState)
  }

  const fetchSearchResults = async (type, text) => {
    let searchResults
    if (type == 'Movie'){
      searchResults = await externalSearch(type, text)
    } else if (type == 'Song') {
      searchResults = await externalSearch(type, text)
    }
    return { searchResults }
  }
  
  useEffect(() => {
    if (!selectedFile || dInput && dInput.trim().length == 0) return;
    fetchSearchResults(selectedFile.type, dInput).then(response => {
      setSearchResults(response.searchResults)
    })
      return () => {
        setSearchResults(null)
      }
  }, [dInput])

  const changeSelection = (item) => {
    updateSearchInput(null)
    setSearchResults(null)
    setSelectedFile(item)
  }

  const applyMovie = async (item) => {
    await addMovie({
      type: selectedFile.type,
      fs_path: selectedFile.fs_path,
      id: item.id,
      title: item.title,
      release_year: parseInt(item.release_date)
    })
  }

  const applyEpisode = async (item) => {
    await addEpisode({
      type: selectedFile.type,
      fs_path: selectedFile.fs_path,
      id: item.id,
      title: item.title
    })
  }

  const applySong = async (item) => {
    await addSong({
      type: selectedFile.type,
      fs_path: selectedFile.fs_path,
      album_id: item.album.id,
      album_name: item.album.name,
      album_release_year: parseInt(item.album.release_date),
      name: item.name,
      disc_number: item.disc_number,
      track_number: item.track_number
    })
  }

  const applyUnknownAlbumSong = async () => {
    await addSong({
      type: selectedFile.type,
      fs_path: selectedFile.fs_path,
      album_name: "Unknown Album"
    })
  }

  const unknownAlbum = (
    <div className="search-result-item">
      <img src={`http://i.imgur.com/bVnx0IY.png`}  width="125" height="125"/>
      <div>
        <h2>{`Didn't find anything? Add to Unknown Album`}</h2>
        <button
          onClick={e =>
            window.confirm("Are you sure you want to apply this item?") &&
            applyUnknownAlbumSong()
          }
          >Apply</button>
      </div>
    </div>
  )
  
  return (
    <div className="movies">
    <AdminHeader />
    <div className="admin">
    <div>
      <h2>About</h2>
      {about && Object.keys(about).map(key => {
          return <p>{`${key}: ${about[key]}`}</p>
      })}
      <h2>Library</h2>
      {stats && (
        <React.Fragment>
          <p>{stats.movies} Movies</p>
          <p>{stats.tv_shows} TV Shows</p>
          <p>{stats.seasons} Seasons</p>
          <p>{stats.episodes} Episodes</p>
          <p>{stats.artists} Artists</p>
          <p>{stats.albums} Albums</p>
          <p>{stats.songs} Songs</p>
          <p>{stats.not_available} Not Available</p>
        </React.Fragment>
      )}
    </div>
    <div>
      <h2>Naming Conventions</h2>
      <p>Your media must appear in the locations set by `.env`. Each media must be in a unique location and cannot share the same directory path(s)</p>
      <p>🎥<strong>Movies</strong></p>
      <pre>
        <code>
          &lt;movies_path&gt;
          - (subdirectory)?
            - (movie_file_name &lt;TMDb-movie-ID&gt;) (.mp4|.mkv)
        </code>
      </pre>
      <p>📺<strong>TV</strong></p>
      <pre>
        <code>
          &lt;tv_path&gt;
          - (tv_show_directory_name &lt;TMDb-tv-show-ID&gt;)
            - (S&lt;season_number&gt;E&lt;episode_number&gt; episode_file_name) (.mp4|.mkv)
        </code>
      </pre>
      <p>🎵<strong>Music</strong></p>
      <pre>
        <code>
          &lt;music_path&gt;
          - (album_directory_name &lt;Spotify-album-ID&gt;)
            - ((&lt;disc_number&gt;-)?&lt;track_number&gt; track_file_name) (.mp3|.flac)
        </code>
      </pre>
      Tracks not found on Spotify can be put a directory titled `Unknown Album` sans disc/ track number
      <pre>
        <code>
          &lt;music_path&gt;
          - Unknown Album
            - (track_file_name) (.mp3|.flac)
        </code>
      </pre>
    </div>

    <div className="media-finder">
      <h2>Media Finder</h2>
      <p>This is a file helper to find media that is currently not available. After the media is found, it will be added to the library and become available</p>
      {selectedFile && <p>Selected file is {selectedFile.fs_path}</p>}
      <div className="tab">
        {notAvailable && notAvailable.map(item => (
          <button key={item.id} onClick={() => changeSelection(item)}>
            <span className="icon">
              {item.type == 'Movie' || item.type == 'Episode'? <FontAwesomeIcon icon={faFileVideo}/> : null}
              {item.type == 'Song'? <FontAwesomeIcon icon={faFileAudio}/> : null}
            </span>
            {item.fs_path}
          </button>
        ))}
      </div>
      {selectedFile && <div className="tabcontent">
        <div className={`${searchBox ? "searchBox" : "searchIcon"}`}>
          <span className="icon" onClick={() => toggleSearchBox()}><FontAwesomeIcon icon={faSearch} /></span>
          <input className="searchInput"
              ref={inputRef}
              value={searchInput}
              onChange={(e) => updateSearchInput(e.currentTarget.value)}
              onBlur={() => setSearchBox(false)}
              type="text" placeholder="Movies, Episodes, Songs..." maxLength="80" />
        </div>
        {selectedFile.type == "Movie" && searchResults && searchResults.results.map(item => (
          <div className="search-result-item">
            <img src={`${process.env.REACT_APP_IMAGE_BASE}original/${item.poster_path}`}  width="100" height="150"/>
            <div>
              <h2>{`${item.title} (${item.original_language}, ${parseInt(item.release_date)})`}</h2>
              <h3>{`TMDB ID: ${item.id}`}</h3>
              <button
                onClick={e =>
                  window.confirm("Are you sure you want to apply this item?") &&
                  applyMovie(item)
                }
                >Apply</button>
            </div>
          </div>
        ))}
        {selectedFile.type == "Song" && unknownAlbum}
        {selectedFile.type == "Song" && searchResults && searchResults.tracks.items.map(item => (
          <div className="search-result-item">
            <img src={item.album.images[0].url}  width="125" height="125"/>
            <div>
              <h2>{`${item.disc_number}-${item.track_number} "${item.name}"`}</h2>
              <h3>{`${item.album.name} (${parseInt(item.album.release_date)})`}</h3>
              <h4>{`Spotify Album ID: ${item.album.id}`}</h4>
              <button
                onClick={e =>
                  window.confirm("Are you sure you want to apply this item?") &&
                  applySong(item)
                }
                >Apply</button>
            </div>
          </div>
        ))}
      </div>}
    </div>

    </div>
    </div>
  );
};

export default Admin;