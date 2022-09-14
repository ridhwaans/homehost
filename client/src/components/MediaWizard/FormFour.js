import React from 'react';
import { addMovie, addEpisode, addSong } from '../../api';
import './styles.css';
import { useGlobalContext } from '../../contexts/context';

const FormFour = () => {
  const { mediaWizard, setMediaWizard } =
    useGlobalContext();

  const next = () => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      currentStep:  mediaWizard.currentStep + 1 
    }));

  };

  const previous = () => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      currentStep:  mediaWizard.currentStep - 1 
    }));
  };

  const applyMovie = async (item) => {
    await addMovie({
      type: mediaWizard.selectedFile.type,
      fs_path: mediaWizard.selectedFile.fs_path,
      id: item.id,
      title: item.title,
      release_year: parseInt(item.release_date),
    });
  };

  const applyEpisode = async (item) => {
    await addEpisode({
      type: mediaWizard.selectedFile.type,
      fs_path: mediaWizard.selectedFile.fs_path,
      id: item.id,
      title: item.title,
    });
  };

  const applySong = async (item) => {
    await addSong({
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
    await addSong({
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
