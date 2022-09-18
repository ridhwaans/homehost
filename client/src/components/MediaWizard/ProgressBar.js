import React from 'react';

import { useGlobalContext } from '../../contexts/context';

const ProgressBar = () => {
  const { mediaWizard } = useGlobalContext();

  console.log(`ProgressBar ` + JSON.stringify(mediaWizard));

  const percent = mediaWizard.currentStep * 100;
  const percentage = mediaWizard.currentStep;

  const background = {
    backgroundColor: '#dee2e6',
    height: 8,
    width: 400,
    borderRadius: 20,
  };

  const progress = {
    backgroundColor: '#43aa8b',
    height: 8,
    width: percent,
    borderRadius: 20,
  };

  const text = {
    fontSize: 12,
    color: '#8d99ae',
  };

  return (
    <div>
      <p style={text}>{percentage} of 4 completed</p>
      <div style={background}>
        <div style={progress}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
