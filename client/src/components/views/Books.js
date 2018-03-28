import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from '../NavBar'
import style from '../../style/App.css'
import * as utils from '../../utils/utils.js'

class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    utils.callApi('/api/books')
      .then(res => this.setState({ files: res }))
      .catch(err => console.log(err));
  }
  
  render() {
    var icon = document.getElementById('icon')
    icon.href = '../../images/favicon-books.ico'

    return (
      <div>
      <NavBar type={3}/>
      <br></br>
      <p className={style.comingSoon}>🚧</p>
      </div>
    );
  }

}

export default Books;
