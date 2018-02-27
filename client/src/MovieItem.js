import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './stylesheet.css';
import * as utils from './utils.js'
import MovieDetails from './MovieDetails';

class MovieItem extends Component {
	constructor(props) {
    super(props)

    this.state = {
      liClass: "grid-item grid-item--light",
      imgClass: "grid-item__link",
      h2Class: "grid-item__title"
    }
  }

	handleClick(e){
		console.log(e.target.id);
		let data = this.props.MovieItemProps

    	let row_i = Math.floor(parseInt(e.target.id)/12); //4
    	data.id = 'row' + row_i;
		var movieDetails = document.getElementById(data.id);
    	//movieDetails.classList.contains('active') ? data.className = 'row' : data.className = 'row active' ;
    	movieDetails.classList.toggle('active');

    	console.log(movieDetails.classList);
		const element = (
	    	<img src={data.poster_path} class={movieDetails.classList}/>
	 	);
    	ReactDOM.render(element, movieDetails);
	  }

	//width="72" height="110"
	render() {
		let data = this.props.MovieItemProps
		return (
			<div id={data.id} className={this.state.liClass} onClick={this.handleClick.bind(this)}>
				<img src={data.poster_path} class={this.state.imgClass} /> 
				<h2 class={this.state.h2Class}>{data.title}</h2>
			</div>
		);
	}
}

//<li onClick={this.handleClick.bind(this)} className={this.state.liClass} id={i}>{i} {items[i]}</li>
export default MovieItem;
