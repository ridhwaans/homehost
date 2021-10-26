import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css'

const FormTwo = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.fileDetails;

    const next = () => {
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
                            <input type="radio" value="Movie" checked={true} />
                            Movie
                        </label>
                        </div>
                        <div className="radio">
                        <label>
                            <input type="radio" value="Episode" />
                            Song
                        </label>
                        </div>
                        <div className="radio">
                        <label>
                            <input type="radio" value="Song" />
                            TV Episode
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormTwo;