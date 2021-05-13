import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/Routes';
import { BrowserRouter } from "react-router-dom";

import './assets/App.css';

ReactDOM.render(
    <BrowserRouter>
        <Routes />
    </BrowserRouter>
    ,
    document.getElementById('root'));




