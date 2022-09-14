import React from 'react';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFileVideo,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { useGlobalContext } from '../../contexts/context';

const FormOne = () => {
  const { data: notAvailable } = useSWR(`/not_available`);
  const { mediaWizard, setMediaWizard } = useGlobalContext();

  console.log(`FormOne ` + JSON.stringify(mediaWizard));
  const changeSelection = (item) => {
    //updateContext.setSelectedFile(item);
    next();
  };

  const next = (item) => {
    if (item.fs_path === null) {
      console.log('Please choose a file');
    } else {
      console.log(JSON.stringify(item));

      setMediaWizard((mediaWizard) => ({
        ...mediaWizard,
        selectedFile: item,
        currentStep: parseInt(mediaWizard.currentStep) + 1,
      }));
    }
  };

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
