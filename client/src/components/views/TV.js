import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from '../NavBar'
import style from '../../style/App.css'
import * as utils from '../../utils/utils.js'

class TV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    utils.callApi('/api/tv')
      .then(res => this.setState({ files: res }))
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div>
      <NavBar/>
      <br></br>
      <p className={style.comingSoon}>🚧</p>
      </div>
    );
  }

}

export default TV;
