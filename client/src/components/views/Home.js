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
          <h3 className="masthead-brand">HomeHost</h3>
          <nav className="nav nav-masthead justify-content-center">
            <a className="nav-link" href="movies">Movies</a>
            <a className="nav-link" href="tv">TV</a>
            <a className="nav-link" href="music">Music</a>
            <a className="nav-link" href="books">Books</a>
            <a className="nav-link" href="comics">Comics</a>
            <a className="nav-link" href="podcasts">Podcasts</a>
          </nav>
        </div>
      </header>

      <main role="main" className="inner cover">
        <h1 className="cover-heading">self-hosted Netflix-like app in React</h1>
        <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p className="lead">
          <a href="#" className="btn btn-lg btn-secondary">Learn more</a>
        </p>
      </main>

      <footer className="mastfoot mt-auto">
        <div className="inner">
          <p>Cover template for <a href="https://getbootstrap.com/">Bootstrap</a>, by <a href="https://twitter.com/mdo">@mdo</a>.</p>
        </div>
      </footer>
      </div>
    );
  }

}

export default Home;
