import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TV from './pages/TV'
import Music from './pages/Music'
import Books from './pages/Books'
import Comics from './pages/Comics'
import Podcasts from './pages/Podcasts'
// import { Home, Movies, TV, Music, Books, Comics, Podcasts } from './pages/index'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/movies" component={Movies}/>
          <Route path="/tv" component={TV}/>
          <Route path="/music" component={Music}/>
          <Route path="/books" component={Books}/>
          <Route path="/comics" component={Comics}/>
          <Route path="/podcasts" component={Podcasts}/>
        </div>
      </Router>
      )
  }
}

export default App;