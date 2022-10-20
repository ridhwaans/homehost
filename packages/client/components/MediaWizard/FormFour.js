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

  const next = () => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      currentStep: mediaWizard.currentStep + 1,
    }));
    if (mediaWizard.selectedFile.name === 'Unknown Album')
      applyUnknownAlbumSong();
    if (mediaWizard.selectedFile.type === 'Song') applySong();
    if (mediaWizard.selectedFile.type === 'Episode') applyEpisode();
    if (mediaWizard.selectedFile.name === 'Movie') applyMovie();
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
    await addItem('tv/episodes/add', {
      type: mediaWizard.selectedFile.type,
      fs_path: mediaWizard.selectedFile.fs_path,
      id: item.id,
      title: item.title,
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
            Go Back{' '}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormFour;
