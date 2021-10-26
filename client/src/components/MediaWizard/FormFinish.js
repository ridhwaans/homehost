import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css';

const FormFinish = () => {

    const myContext = useContext(AppContext);
    const updateContext = myContext.userDetails;

    const name = updateContext.userName;

    const finish = () => {
        console.log(updateContext);
    }
    return (
        <div className="container">
            <p>Successfully Submitted</p>
            <p>Thanks for {name} your details</p>
            <img className="done" src="https://www.svgrepo.com/show/13650/success.svg" alt="successful" />
            <button className="doneSubmit" onClick={finish}>Done</button>
        </div>
    );
};

export default FormFinish;