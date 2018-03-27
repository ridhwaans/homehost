import React from 'react'
import ReactDOM from 'react-dom'

class NavBar extends React.Component {

  constructor (props) {
    super(props)

    this.state = {}
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
	            <a class="nav-link" href="movies">Movies</a>
	          </li>
	          <li class="nav-item">
	            <a class="nav-link" href="tv">TV</a>
	          </li>
	          <li class="nav-item">
	            <a class="nav-link" href="music">Music</a>
	          </li>
	          <li class="nav-item">
	            <a class="nav-link" href="books">Books</a>
	          </li>
	          <li class="nav-item">
	            <a class="nav-link" href="comics">Comics</a>
	          </li>
	          <li class="nav-item">
	            <a class="nav-link" href="podcasts">Podcasts</a>
	          </li>
	        </ul>
	      </div>
	    </nav>
		)
  	}
}
export default NavBar