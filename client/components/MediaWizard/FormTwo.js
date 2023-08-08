import React from 'react';

import { useGlobalContext } from '../../contexts/context';
import './styles.css';

const FormTwo = () => {
  const { mediaWizard, setMediaWizard } = useGlobalContext();

  const next = (type) => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      selectedFile: { ...mediaWizard.selectedFile, type: type },
      currentStep: mediaWizard.currentStep + 1,
    }));
  };
  const previous = () => {
    setMediaWizard((mediaWizard) => ({
      ...mediaWizard,
      selectedFile: { ...mediaWizard.selectedFile, type: null },
      currentStep: mediaWizard.currentStep - 1,
    }));
  };

  return (
    <div className="container">
      <p>
        What type of file is this? <b>{mediaWizard.selectedFile.fs_path}</b>
      </p>
      <div></div>
      <div className="formContain">
        <form className="form">
          <div className="radioForm">
            <div className="radio" onClick={() => next('Movie')}>
              <img
                className="otpimg"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSphyVbgs_TuSMfe6KlGUIEuujPrS1lgY8hpw&usqp=CAU"
                alt="otp-img"
              />
              <label>Movie</label>
            </div>
            <div className="radio" onClick={() => next('Episode')}>
              <img
                className="otpimg"
                src="https://static.thenounproject.com/png/3962601-200.png"
                alt="otp-img"
              />
              <label>TV Episode</label>
            </div>
            <div className="radio" onClick={() => next('Song')}>
              <img
                className="otpimg"
                src="http://i.imgur.com/bVnx0IY.png"
                alt="otp-img"
              />
              <label>Song</label>
            </div>
          </div>
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

export default FormTwo;
