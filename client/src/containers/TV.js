import React, { Component } from 'react'
import NavBar from '../components/NavBar'
import FooterBar from '../components/FooterBar'
import style from '../style/App.css'
import * as utils from '../utils/utils.js'

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
        <NavBar type={2}/>
        <br></br>
        <p className={style.comingSoon}>🚧</p>
        <FooterBar/>
      </div>
    );
  }

}

export default TV;
