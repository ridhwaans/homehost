import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NotFoundRoute, BrowserHistory } from 'react-router-dom'
import Home from './Home'
import Movies from './Movies'
import TV from './TV'
import Music from './Music'
import Books from './Books'
import Comics from './Comics'
import Podcasts from './Podcasts'
import Disclaimer from './Disclaimer'
import NotFound from './NotFound'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/movies" component={Movies}/>
          <Route path="/tv" component={TV}/>
          <Route path="/music" component={Music}/>
          <Route path="/books" component={Books}/>
          <Route path="/comics" component={Comics}/>
          <Route path="/podcasts" component={Podcasts}/>
          <Route path="/disclaimer" component={Disclaimer}/>
          <Route component={NotFound}/>
      </Switch>
      </Router>
      )
  }
}

export default App;