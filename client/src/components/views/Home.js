import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
      <header className="masthead mb-auto">
        <div className="inner">
          <h1 className="masthead-brand">homehost</h1>
          <nav className="nav nav-masthead justify-content-left">
            <a className="nav-link" href="movies">🎥 Movies</a>
            <a className="nav-link" href="tv">📺 TV</a>
            <a className="nav-link" href="music">🎵 Music</a>
            <a className="nav-link" href="books">📚 Books</a>
            <a className="nav-link" href="comics">📒 Comics</a>
            <a className="nav-link" href="podcasts">🎙️ Podcasts</a>
          </nav>
        </div>
      </header>
      <br/>
      <main role="main" className="inner cover">
        <h2 className="cover-heading">self-hosted Netflix-like app in React</h2>
        <p className="lead">homehost is made to stream your media collection over the home network</p>
        <p className="lead">
          <a href="https://github.com/ridhwaans/homehost/" className="btn btn-outline-secondary">View on Github</a>
        </p>
      </main>
      <br/>
      <footer className="mastfoot mt-auto">
        <div className="inner">
          <p>Made with ❤️ by <a href="https://github.com/ridhwaans">@ridhwaans</a>.</p>
        </div>
      </footer>
      </div>
    );
  }

}

export default Home;
