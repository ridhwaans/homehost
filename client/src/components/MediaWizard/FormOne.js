import React, {useState, useEffect, useRef, useContext} from 'react';
import AppContext from './Context';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFileVideo, faFileAudio } from '@fortawesome/free-solid-svg-icons'
import { getNotAvailable } from "../../api"

const FormOne = () => {
    const [notAvailable, setNotAvailable] = useState(null)
    let myContext = useContext(AppContext);
    let updateContext = myContext.fileDetails;

    const fetch = async () => {
        let notAvailable = await getNotAvailable()
    
        return { notAvailable }
      }

    useEffect(() => {
    
        fetch().then(response => {
          setNotAvailable(response.notAvailable)
        })
          return () => {
            setNotAvailable(null)
          }
      }, [])

    const changeSelection = (item) => {
        //alert(JSON.stringify(item))
        updateContext.setSelectedFile(item)
        console.log(updateContext.selectedFile)
        next()
    }
    
    const next = () => {
        if (updateContext.selectedFile) {
            if (updateContext.selectedFile.fs_path == null) {
                console.log('Please choose a file')
            } else (updateContext.setStep(updateContext.currentPage + 1))
        }
    };

    console.log(JSON.stringify(updateContext))
    return (
        <div className="contain">
            <p>Enter Your Details</p>
            <form className="form">
                <div className="tab">
                    {notAvailable && notAvailable.map(item => (
                    <button key={item.id} onClick={() => changeSelection(item)}>
                        <span className="icon">
                        {item.type == 'Movie' || item.type == 'Episode'? <FontAwesomeIcon icon={faFileVideo}/> : null}
                        {item.type == 'Song'? <FontAwesomeIcon icon={faFileAudio}/> : null}
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