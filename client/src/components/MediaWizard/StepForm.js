import React, {useState, useEffect, useRef, useContext} from 'react';
import './styles.css';
import AppContext from './Context';
import FormOne from './FormOne';
import FormTwo from './FormTwo';
import FormThree from './FormThree';
import FormFour from './FormFour';
import FormFive from './FormFive';
import FormFinish from './FormFinish';
import ProgressBar from './ProgressBar';

const StepForm = () => {

    const [step, setStep] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null)
    const [searchBox, setSearchBox] = useState(false)
    const inputRef = useRef(null)
    const [ searchInput, updateSearchInput ] = useState(null)
    const [ searchResults, setSearchResults ] = useState(null)

    const fileDetails = {
        selectedFile: selectedFile,
        currentPage: step,
        setSelectedFile,
        setStep,
        setSearchBox,
        updateSearchInput,
        setSearchResults
    }
    console.log(step)
    return (
        <AppContext.Provider value={{fileDetails}}>
            <div className="main">
            <div className="navbar">
                 <img src="https://www.vectorlogo.zone/logos/dartlang/dartlang-ar21.svg" alt="logo" />
             </div>
             <div className="body">
                 <h3>Multi Step Form using ReactJS</h3>
                 <div className="wrapper">
                 <ProgressBar />
                 {step === 0 && <FormOne /> }
                 {step === 1 && <FormTwo /> }
                 {step === 2 && <FormThree /> }
                 {step === 3 && <FormFour /> }
                 {step === 4 && <FormFive /> }
                 {step === 5 && <FormFinish /> }
                 </div>
             </div>
        </div>
        </AppContext.Provider>
    );
};

export default StepForm;