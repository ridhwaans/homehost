import React, { useContext } from 'react';
import AppContext from './Context';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFileVideo,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const FormOne = () => {
  const { data: notAvailable } = useSWR(`/not_available`);
  let myContext = useContext(AppContext);
  let updateContext = myContext.fileDetails;

  const changeSelection = (item) => {
    updateContext.setSelectedFile(item);
    next();
  };

  const next = (item) => {
    if (item.fs_path === null) {
      console.log('Please choose a file');
    } else {
      console.log(JSON.stringify(item));
      updateContext.setSelectedFile(item);
      updateContext.setStep((prevStep) => prevStep + 1);
    }
  };

  console.log(JSON.stringify(updateContext));
  return (
    <div className="contain">
      <p>Choose a file</p>
      <form className="form">
        <div className="tab">
          {notAvailable &&
            notAvailable.map((item) => (
              <button type="button" key={item.id} onClick={() => next(item)}>
                <span className="icon">
                  {item.type === 'Movie' || item.type === 'Episode' ? (
                    <FontAwesomeIcon icon={faFileVideo} />
                  ) : null}
                  {item.type === 'Song' ? (
                    <FontAwesomeIcon icon={faFileAudio} />
                  ) : null}
                </span>
                {item.fs_path}
              </button>
            ))}
        </div>
      </form>
    </div>
  );
};

export default FormOne;
