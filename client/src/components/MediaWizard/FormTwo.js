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
            <div>
            </div>
            <div className="formContain">
                <form className="form">
                <div className="radioForm">
                    <div className="radio" onClick={() => next("Movie")}>
                        <img className="otpimg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSphyVbgs_TuSMfe6KlGUIEuujPrS1lgY8hpw&usqp=CAU" alt="otp-img" />
                        <label>
                            Movie
                        </label>
                        </div>
                        <div className="radio" onClick={() => next("Episode")}>
                        <img className="otpimg" src="https://static.thenounproject.com/png/3962601-200.png" alt="otp-img" />
                        <label>
                            TV Episode
                        </label>
                        </div>
                        <div className="radio" onClick={() => next("Song")}>
                        <img className="otpimg" src="http://i.imgur.com/bVnx0IY.png" alt="otp-img" />
                        <label>
                            Song
                        </label>
                    </div>
                    </div>
                    <button className="formSubmit" value="Previous" type="submit" onClick={previous}>Go Back </button>
                </form>
            </div>
        </div>
    );
};

export default FormTwo;