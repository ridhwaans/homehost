import React from 'react';

import { useGlobalContext } from '../../contexts/context';
import FormFinish from './FormFinish';
import FormFour from './FormFour';
import FormOne from './FormOne';
import FormThree from './FormThree';
import FormTwo from './FormTwo';
import ProgressBar from './ProgressBar';
import './styles.css';

const StepForm = () => {
  const { mediaWizard } = useGlobalContext();

  return (
    <div className="main">
      <div className="body">
        <div className="wrapper">
          <ProgressBar />
          {mediaWizard.currentStep === 0 && <FormOne />}
          {mediaWizard.currentStep === 1 && <FormTwo />}
          {mediaWizard.currentStep === 2 && <FormThree />}
          {mediaWizard.currentStep === 3 && <FormFour />}
          {mediaWizard.currentStep === 4 && <FormFinish />}
        </div>
      </div>
    </div>
  );
};

export default StepForm;
