import React, { Component } from 'react';
import SearchBox from './Search';
import Grid from './Grid';
import './App.css';
import logo from './logo.svg';
import * as utils from './utils.js'

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    //this.callApi()
    utils.callApi('/api/hello')
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">{this.state.response}</p>
      </div>
      <SearchBox/>
      <Grid/>
      </div>
    );
  }
}

export default App;
