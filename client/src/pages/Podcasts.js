import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from '../components/NavBar'
import * as utils from '../utils/utils.js'

class Podcasts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    utils.callApi('/api/podcasts')
      .then(res => this.setState({ files: res }))
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div>
      <NavBar/>
      <br></br>
      <p className="coming-soon">Coming Soon</p>
      </div>
    );
  }

}

export default Podcasts;
