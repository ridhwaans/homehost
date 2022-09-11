import React, { useState } from 'react';
import './styles.css';
import AppContext from './Context';
import FormOne from './FormOne';
import FormTwo from './FormTwo';
import FormThree from './FormThree';
import FormFour from './FormFour';
import FormFinish from './FormFinish';
import ProgressBar from './ProgressBar';

const StepForm = () => {
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileDetails = {
    selectedFile: selectedFile,
    currentPage: step,
    setSelectedFile,
    setStep,
  };
  console.log(step);
  return (
    <AppContext.Provider value={{ fileDetails }}>
      <div className="main">
        <div className="body">
          <div className="wrapper">
            <ProgressBar />
            {step === 0 && <FormOne />}
            {step === 1 && <FormTwo />}
            {step === 2 && <FormThree />}
            {step === 3 && <FormFour />}
            {step === 4 && <FormFinish />}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default StepForm;
