import React from 'react';

import { useGlobalContext } from '../../contexts/context';
import './styles.css';

const addItem = (resource, data) =>
  fetch(`${process.env.REACT_APP_HOMEHOST_BASE}/api` + resource, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

const FormFour = () => {
  const { mediaWizard, setMediaWizard } = useGlobalContext();

  const next = async () => {
    const { selectedFile, selectedMetadata, unknownAlbum } = mediaWizard;
    if (!selectedFile) return;

    if (selectedFile.type === 'Song' && unknownAlbum) {
      await applyUnknownAlbumSong();
    } else if (selectedFile.type === 'Song' && selectedMetadata) {
      await applySong(selectedMetadata);
    } else if (selectedFile.type === 'Episode' && selectedMetadata) {
      await applyEpisode(selectedMetadata);
    } else if (selectedFile.type === 'Movie' && selectedMetadata) {
      await applyMovie(selectedMetadata);
    } else {
      return;
    }

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
    const episode = mediaWizard.selectedFile.fs_path.match(/S(\d{1,2})E(\d{1,2})/i);
    if (!episode) return;

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
