import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from '../NavBar'
import style from '../../style/App.css'
import * as utils from '../../utils/utils.js'

class Comics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    utils.callApi('/api/comics')
      .then(res => this.setState({ files: res }))
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div>
      <NavBar type={4}/>
      <br></br>
      <p className={style.comingSoon}>🚧</p>
      </div>
    );
  }

}

export default Comics;
