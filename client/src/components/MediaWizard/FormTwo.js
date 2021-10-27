import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css'

const FormTwo = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.fileDetails;

    const next = (type) => {
        updateContext.setSelectedFile(
            {                   
                ...updateContext.selectedFile,
                type: type
            }
        )
        updateContext.setStep(updateContext.currentPage + 1)
    };
    const previous = () => {
        updateContext.setStep(updateContext.currentPage - 1)
    };
    
    return (
        <div className="container">
            <p>What type of file is this? <b>{updateContext.selectedFile.fs_path}</b></p>
            <img className="otpimg" src="https://ecall-messaging.com/wp-content/uploads/2020/11/eCall_Illustration_mTAN.svg" alt="otp-img" />
            <div className="formContain">
                <form className="form">
                    <div className="radio">
                        <label>
                            <input type="radio" value="Movie" checked={true} onClick={() => next("Movie")}/>
                            Movie
                        </label>
                        </div>
                        <div className="radio">
                        <label>
                            <input type="radio" value="Episode" onClick={() => next("Episode")}/>
                            TV Episode
                        </label>
                        </div>
                        <div className="radio">
                        <label>
                            <input type="radio" value="Song" onClick={() => next("Song")}/>
                            Song
                        </label>
                    </div>
                    <button className="formSubmit" value="Previous" type="submit" onClick={previous}>Go Back </button>
                </form>
            </div>
        </div>
    );
};

export default FormTwo;