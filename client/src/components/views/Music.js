import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from '../NavBar'
import Grid from '../Grid'
import SearchBox from '../SearchBox'
import * as utils from '../../utils/utils.js'

class Music extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    utils.callApi('/api/music')
      .then(res => this.setState({ files: res }))
      .catch(err => console.log(err));
  }
  
  render() {
    var items = this.state.files;
    var data = [];
    for (var i = 0; i < items.length; i++) {
      data.push({
        spotify_id: items[i].id,
        album_name: items[i].name, 
        album_art: items[i].images[0].url,
        url_path: items[i].url_path,
        preview_url: items[i].preview_url,
        release_date: items[i].release_date, 
        artist_name: items[i].artists[0].name, 
        label: items[i].label,
        tracks: items[i].tracks
      });
    }

    var data_string = JSON.stringify(data);
    return (
      <div>
      <NavBar/>
      <br></br>
      <Grid
          gridData={data_string}
          gridCell_width={175}
          gridCell_height={175}
          type={1}
      />
      </div>
    );
  }

}

export default Music;
