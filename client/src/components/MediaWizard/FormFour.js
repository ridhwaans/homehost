import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css';

const FormFour = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.userDetails;

    const next = () => {
        if (updateContext.vehBrand == null) {
            console.log('Please select the Brand')
        } else if (updateContext.userVehicle == null) {
            console.log('Please select your Vehicle')
        } else if (updateContext.vehYear == null) {
            console.log('Please enter the Year')
        } else if (updateContext.vehValue == null) {
            console.log('Enter the value of your Car')
        } else (updateContext.setStep(updateContext.currentPage + 1))
    };

    return (
        <div className="container">
            <p>Enter your vehicle details</p>
            <div className="formContainer">
                <form className="form">
                    <label>
                    <select className="formSelect" onChange={e => updateContext.setBrand(e.target.value)} >
                        <option >Select Brand</option>
                        <option value="tesla">Tesla</option>
                        <option value="ford">Ford</option>
                        <option value="tata">Tata</option>
                    </select>
                    </label>
                    <label>
                    <select className="formSelect" onChange={e => updateContext.setModel(e.target.value)} >
                        <option>Vehicle Model</option>
                        <option value="model-x">Model X</option>
                        <option value="model-y">Model Y</option>
                        <option value="model-z">Model Z</option>
                    </select>
                    </label>
                    <label>
                    <select className="formSelect" onChange={e => updateContext.setYear(e.target.value)}>
                        <option >Manufacturing Year</option>
                        <option value="1999">1999</option>
                        <option value="2000">2000</option>
                        <option value="2001">2001</option>
                        <option value="2002">2002</option>
                    </select>
                    </label>
                    <input className="formInput" type="text" placeholder="Vehicle Value" onChange={e => updateContext.setValue(e.target.value)} />
                    <button type="button" className="formSubmit" onClick={next}>Next </button>
                </form>
            </div>
        </div>
    );
};

export default FormFour;