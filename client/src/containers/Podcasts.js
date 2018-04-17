import React, { Component } from 'react'
import NavBar from '../components/NavBar'
import FooterBar from '../components/FooterBar'
import style from '../style/App.css'
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
        <NavBar type={5}/>
        <br></br>
        <p className={style.comingSoon}>🚧</p>
        <FooterBar/>
      </div>
    );
  }

}

export default Podcasts;
