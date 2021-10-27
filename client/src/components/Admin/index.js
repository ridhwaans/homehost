import React, { useEffect, useState } from 'react';
import { getAbout, getLibraryStats } from "../../api"
import AdminHeader from "../AdminHeader"
import StepForm from '../MediaWizard/StepForm';

const Admin = () => {

  const [about, setAbout] = useState(null)
  const [stats, setStats] = useState(null)

  const fetch = async () => {
    let about = await getAbout()
    let stats = await getLibraryStats()

    return { about, stats }
  }

  useEffect(() => {
    document.documentElement.className = "movies-html-and-body"; //<html>
    document.body.className = "movies-html-and-body"; //<body>

    fetch().then(response => {
      setAbout(response.about)
      setStats(response.stats)
    })
      return () => {
        setAbout(null)
        setStats(null)
      }
  }, [])
  
  return (
    <React.Fragment>
    
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
    <StepForm />
    </div>
    </div>
    
    </React.Fragment>
  );
};

export default Admin;