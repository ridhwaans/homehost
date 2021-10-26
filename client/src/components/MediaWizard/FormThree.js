import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css'

const FormThree = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.fileDetails;

    const next = () => {
        if (updateContext.userOTP == null || updateContext.userOTP.length !== 4) {
            console.log('Please enter the OTP correctly')
        } else (updateContext.setStep(updateContext.currentPage + 1))
    };
    const previous = () => {
        updateContext.setStep(updateContext.currentPage - 1)
    };
    
    return (
        <div className="container">
            <p>Enter the OTP recieved on your Phone no. <b>{updateContext.userPhone}</b></p>
            <img className="otpimg" src="https://ecall-messaging.com/wp-content/uploads/2020/11/eCall_Illustration_mTAN.svg" alt="otp-img" />
            <div className="formContain">
                <form className="form">
                    <input className="formInput" type="text" maxLength="4" placeholder="Enter OTP" onChange={e => updateContext.setOTP(e.target.value)} required/>
                    <button className="formSubmit" value="Next" type="submit" onClick={next}>Next </button>
                    <button className="formSubmit" value="Previous" type="submit" onClick={previous}>Previous </button>
                </form>
            </div>
        </div>
    );
};

export default FormThree;