import React from 'react';
import './styles.css';
import FormOne from './FormOne';
import FormTwo from './FormTwo';
import FormThree from './FormThree';
import FormFour from './FormFour';
import FormFinish from './FormFinish';
import ProgressBar from './ProgressBar';
import { useGlobalContext } from '../../contexts/context';

const StepForm = () => {
  const { mediaWizard, setMediaWizard } = useGlobalContext();

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
