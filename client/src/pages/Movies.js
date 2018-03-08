import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Grid from '../components/Grid'
import SearchBox from '../components/SearchBox'
import * as utils from '../utils/utils.js'

class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    utils.callApi('/api/movies')
      .then(res => this.setState({ files: res }))
      .catch(err => console.log(err));
  }
  
  render() {
    var items = this.state.files;
    var data = [];
    for (var i = 0; i < items.length; i++) {
      data.push({
        tmdb_id: items[i]["id"], 
        imdb_id: items[i]["imdb_id"], 
        title: items[i]["title"], 
        img: "https://image.tmdb.org/t/p/w500" + items[i]["poster_path"], //poster_path
        backdrop_path: "https://image.tmdb.org/t/p/original" + items[i]["backdrop_path"], 
        url_path: items[i]["url_path"], 
        release_date: items[i]["release_date"], 
        runtime: items[i]["runtime"], 
        revenue: items[i]["revenue"],
        description: items[i]["overview"], //overview
        tagline: items[i]["tagline"], 
        link: "http://www.imdb.com/title/" + items[i]["imdb_id"]
      });
    }

    var data_string = JSON.stringify(data);
    return (
      <div>
      <NavBar/>
      <br></br>
      <Grid
          gridData={data_string}
          CellDetail_image_size={300}
          cellSize={200}
      />
      </div>
    );
  }

}

export default Movies;
