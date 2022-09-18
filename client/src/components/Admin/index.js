import React, { useEffect } from 'react';
import useSWR from 'swr';

import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import StepForm from '../MediaWizard/StepForm';
import './Admin.css';

const Admin = () => {
  const { data: about } = useSWR('/about');
  const { data: stats } = useSWR('/library/stats');

  useEffect(() => {
    document.documentElement.className = 'admin-html-and-body'; //<head>
    document.body.className = 'admin-html-and-body'; //<body>
  }, []);

  return (
    <React.Fragment>
      <AdminHeader />
      <div className="responsive-account-container">
        <h1 className="account-header">Account</h1>

        <div className="account-section">
          <header className="account-section-header">
            <h2 className="account-section-heading">Server Information</h2>
          </header>

          <section className="account-section-content">
            {about &&
              Object.keys(about).map((prop, index) => {
                return <p key={index}>{`${prop}: ${about[prop]}`}</p>;
              })}
          </section>
        </div>

        <div className="account-section">
          <header className="account-section-header">
            <h2 className="account-section-heading">Library</h2>
          </header>

          <section className="account-section-content">
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
          </section>
        </div>

        <div className="account-section">
          <header className="account-section-header">
            <h2 className="account-section-heading">Media Wizard</h2>
          </header>

          <section className="account-section-content">
            <StepForm />
          </section>
        </div>

        <div className="account-section">
          <header className="account-section-header">
            <h2 className="account-section-heading">Naming Conventions</h2>
          </header>

          <section className="account-section-content">
            <p>
              Your media must appear in the locations set by <code>.env</code>.
              Each media must be in a unique location and cannot share the same
              directory path(s)
            </p>
            <p>
              🎥<strong>Movies</strong>
            </p>
            <pre>
              <code>
                &lt;movies_path&gt; - (subdirectory)? - (movie_file_name
                &lt;TMDb-movie-ID&gt;) (.mp4|.mkv)
              </code>
            </pre>
            <p>
              📺<strong>TV</strong>
            </p>
            <pre>
              <code>
                &lt;tv_path&gt; - (tv_show_directory_name
                &lt;TMDb-tv-show-ID&gt;) -
                (S&lt;season_number&gt;E&lt;episode_number&gt;
                episode_file_name) (.mp4|.mkv)
              </code>
            </pre>
            <p>
              🎵<strong>Music</strong>
            </p>
            <pre>
              <code>
                &lt;music_path&gt; - (album_directory_name
                &lt;Spotify-album-ID&gt;) -
                ((&lt;disc_number&gt;-)?&lt;track_number&gt; track_file_name)
                (.mp3|.flac)
              </code>
            </pre>
            Tracks not found on Spotify can be put a directory titled `Unknown
            Album` sans disc/ track number
            <pre>
              <code>
                &lt;music_path&gt; - Unknown Album - (track_file_name)
                (.mp3|.flac)
              </code>
            </pre>
          </section>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Admin;
