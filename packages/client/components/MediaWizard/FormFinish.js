import React from 'react';

import './styles.css';

const FormFinish = () => {
  const finish = () => {
    console.log('finish');
  };
  return (
    <div className="container">
      <p>Successfully Submitted</p>
      <p>Thanks for your details</p>
      <img
        className="done"
        src="https://www.svgrepo.com/show/13650/success.svg"
        alt="successful"
      />
      <button className="doneSubmit" onClick={finish}>
        Done
      </button>
    </div>
  );
};

export default FormFinish;
