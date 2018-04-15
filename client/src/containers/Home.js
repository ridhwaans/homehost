import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FooterBar from '../components/FooterBar'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate (prevProps, prevState){
    var video = document.getElementById('myVideo');
    if (video.paused) video.play()
  }

  render() {
    let videoStyle = {
      position: 'fixed',
      right: 0, 
      bottom: 0, 
      minWidth: '100%', 
      minHeight: '100%'
    }
    let divStyle = {
      position: 'fixed',
      color: '#ffffff', 
      background: 'rgba(0,0,0,0.4)',
      padding: '20px',
      width: '100%'
    }
    let aStyle = {
      color: '#ffffff'
    }

    return (
      <div>
       <video autoPlay muted loop id="background-video" style={videoStyle}>
        <source src="https://coverr.co/s3/mp4/Home.mp4" type="video/mp4"/>
        Your browser does not support HTML5 video.
      </video>
      <div className="d-flex h-100 flex-column text-center" style={divStyle}>
      <header className="masthead mb-auto">
        <div className="inner">
          <h1 className="masthead-brand">homehost</h1>
          <nav className="nav justify-content-center">
            <a className="nav-link" style={aStyle} href="movies">🎥 Movies</a>
            <a className="nav-link" style={aStyle} href="tv">📺 TV</a>
            <a className="nav-link" style={aStyle} href="music">🎵 Music</a>
            <a className="nav-link" style={aStyle} href="books">📚 Books</a>
            <a className="nav-link" style={aStyle} href="comics">📒 Comics</a>
            <a className="nav-link" style={aStyle} href="podcasts">🎙️ Podcasts</a>
          </nav>
        </div>
      </header>
      <main role="main" className="inner cover">
        <h2 className="cover-heading">self-hosted Netflix-like app in React</h2>
        <p className="lead">homehost is made to stream your media collection over the home network</p>
        <p className="lead">
          <a href="https://github.com/ridhwaans/homehost/" className="btn btn-primary">View on Github</a>
        </p>
      </main>
      <footer className="mastfoot mt-auto">
        <FooterBar/>
      </footer>
      
      </div>
      </div>
    );
  }

}

export default Home;
