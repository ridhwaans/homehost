import React from 'react'
import ReactDOM from 'react-dom'

class NavBar extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
    	type: this.props.type
    }
  }

  render() {
  	return (
  		<nav class="navbar navbar-expand navbar-dark bg-dark">
	      <a class="navbar-brand" href="http://localhost:3000">HOMEHOST</a>
	      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
	        <span class="navbar-toggler-icon"></span>
	      </button>
	      <div class="collapse navbar-collapse" id="navbarsExample02">
	        <ul class="navbar-nav mr-auto">
	          <li class="nav-item">
	            <a class={(this.state.type === type.MOVIES) ? "active nav-link" : "nav-link"} href="movies">Movies</a>
	          </li>
	          <li class="nav-item">
	            <a class={(this.state.type === type.TV) ? "active nav-link" : "nav-link"} href="tv">TV</a>
	          </li>
	          <li class="nav-item">
	            <a class={(this.state.type === type.MUSIC) ? "active nav-link" : "nav-link"} href="music">Music</a>
	          </li>
	          <li class="nav-item">
	            <a class={(this.state.type === type.BOOKS) ? "active nav-link" : "nav-link"} href="books">Books</a>
	          </li>
	          <li class="nav-item">
	            <a class={(this.state.type === type.COMICS) ? "active nav-link" : "nav-link"} href="comics">Comics</a>
	          </li>
	          <li class="nav-item">
	            <a class={(this.state.type === type.PODCASTS) ? "active nav-link" : "nav-link"} href="podcasts">Podcasts</a>
	          </li>
	        </ul>
	      </div>
	    </nav>
		)
  	}
}

const type = {
  MOVIES: 0,
  MUSIC: 1,
  TV: 2,
  BOOKS: 3,
  COMICS: 4,
  PODCASTS: 5
}

export default NavBar