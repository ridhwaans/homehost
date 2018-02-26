import React, { Component } from 'react';
import './stylesheet.css';
import * as utils from './utils.js'
import MovieDetails from './MovieDetails';

class MovieItem extends Component {
	constructor(props) {
    super(props)

    this.state = {
      liClass: "grid-item grid-item--light"	
    }
  }

	handleClick(e){
	    	console.log(e.target.id);
	    	let id = Math.floor(parseInt(e.target.id)/12); //4
	    	console.log(id);
	    	var movieDetails = document.getElementById('row' + id);
	    	console.log(movieDetails);
	    movieDetails.classList.contains('active') ? movieDetails.className='row' : movieDetails.className='row active' ;
	  }

	render() {
		let data = this.props.MovieItemProps
		return (
			<div id={data.id} className={this.state.liClass} onClick={this.handleClick.bind(this)}>
				<img src={data.fileposter} class="grid-item__link hoverZoomLink" alt="tester" width="72" height="110"/>
				<h2 class="grid-item__title">{data.filename}</h2>
			</div>
		);
	}
}

//<li onClick={this.handleClick.bind(this)} className={this.state.liClass} id={i}>{i} {items[i]}</li>
export default MovieItem;
