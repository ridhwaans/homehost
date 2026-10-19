import React, { useState } from 'react';

import { useGlobalContext } from '../../contexts/context';
import './styles.css';

const addItem = async (resource, data) => {
  const response = await fetch(
    `${process.env.REACT_APP_HOMEHOST_BASE}/api/${resource}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Import failed (HTTP ${response.status}). Please try again.`
    );
  }
  return response.json();
};

const FormFour = () => {
  const { mediaWizard, setMediaWizard } = useGlobalContext();
  const [error, setError] = useState('');

  const next = async () => {
    const { selectedFile, selectedMetadata, unknownAlbum } = mediaWizard;
    setError('');
    try {
      if (selectedFile.type === 'Song' && unknownAlbum) {
        await applyUnknownAlbumSong();
      } else if (selectedFile.type === 'Song') {
        await applySong(selectedMetadata);
      } else if (selectedFile.type === 'Episode') {
        await applyEpisode(selectedMetadata);
      } else {
        await applyMovie(selectedMetadata);
      }

      setMediaWizard((mediaWizard) => ({
        ...mediaWizard,
        currentStep: mediaWizard.currentStep + 1,
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const previous = () => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      currentStep: mediaWizard.currentStep - 1,
    }));
  };

  const applyMovie = async (item) => {
    await addItem('movies/add', {
      type: mediaWizard.selectedFile.type,
      fs_path: mediaWizard.selectedFile.fs_path,
      id: item.id,
      title: item.title,
      release_year: parseInt(item.release_date),
    });
  };

  const applyEpisode = async (item) => {
    const episode =
      mediaWizard.selectedFile.fs_path.match(/S(\d{1,2})E(\d{1,2})/i);
    if (!episode) {
      throw new Error(
        'Use a filename containing season and episode numbers, such as S01E02.'
      );
    }

    await addItem('tv/episodes/add', {
      type: mediaWizard.selectedFile.type,
      fs_path: mediaWizard.selectedFile.fs_path,
      id: item.id,
      tv_show_id: item.id,
      tv_show_name: item.name,
      season_number: parseInt(episode[1]),
      episode_number: parseInt(episode[2]),
    });
  };

  const applySong = async (item) => {
    await addItem('music/songs/add', {
      type: mediaWizard.selectedFile.type,
      fs_path: mediaWizard.selectedFile.fs_path,
      album_id: item.album.id,
      album_name: item.album.name,
      album_release_year: parseInt(item.album.release_date),
      name: item.name,
      disc_number: item.disc_number,
      track_number: item.track_number,
    });
  };

  const applyUnknownAlbumSong = async () => {
    await addItem('music/songs/add', {
      type: mediaWizard.selectedFile.type,
      fs_path: mediaWizard.selectedFile.fs_path,
      album_name: 'Unknown Album',
    });
  };

  return (
    <div className="container">
      <p>Is this information correct?</p>
      {error && <p role="alert">{error}</p>}
      <div className="formContainer">
        <form className="form">
          <button
            className="formSubmit"
            value="Next"
            type="button"
            onClick={next}
          >
            Next{' '}
          </button>
          <button
            className="formSubmit"
            value="Previous"
            type="button"
            onClick={previous}
          >
            Go Back{' '}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormFour;
