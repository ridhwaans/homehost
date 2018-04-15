import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import NavBar from '../components/NavBar'
import FooterBar from '../components/FooterBar'
import style from '../style/App.css'
import * as utils from '../utils/utils.js'

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
    return (
      <div>
      <NavBar type={3}/>
      <br></br>
      <p className={style.comingSoon}>🚧</p>
      <FooterBar/>
      </div>
    );
  }

}

export default Books;
