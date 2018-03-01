import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import ReactExpandableGrid from './components/react-expandable-grid.js'
import SearchBox from './Search';
import Grid from './Grid';
import './App.css';
import logo from './logo.svg';
import * as utils from './utils.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [
      {
        "id": 62,
        "imdb_id": "tt0062622",
        "title": "2001: A Space Odyssey",
        "poster_path": "/90T7b2LIrL07ndYQBmSm09yqVEH.jpg",
        "backdrop_path": "/pckdZ29bHj11hBsV3SbVVfmCB6C.jpg",
        "file_path": "/mnt/d/Film/2001.A.Space.Odyssey.1968.720p.BrRip.x264.YIFY.62.mp4",
        "release_date": "1968-04-09",
        "runtime": 149,
        "revenue": 68700000,
        "overview": "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer.",
        "tagline": "An epic drama of adventure and exploration"
      }
      ]
    };
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
        file_path: items[i]["file_path"], 
        release_date: items[i]["release_date"], 
        runtime: items[i]["runtime"], 
        revenue: items[i]["revenue"],
        description: items[i]["overview"], //overview
        tagline: items[i]["tagline"], 
        link: 'https://www.google.com'
      });
    }

    var data_string = JSON.stringify(data);
    return (
      <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
      </div>  
      <SearchBox/>
      <ReactExpandableGrid
          gridData={data_string}
          detailHeight={300}
          ExpandedDetail_image_size={300}
          cellSize={200}
      />
      </div>
    );
  }

  componentDidMount() {
    utils.callApi('/api/movies')
      .then(res => this.setState({ files: res }))
      .catch(err => console.log(err));
  }

}

export default App;
