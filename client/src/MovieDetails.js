import React, { Component } from 'react';
import './stylesheet.css';
import * as utils from './utils.js'
import MovieItem from './MovieItem';

class MovieDetails extends Component {
	constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
		let data = this.props.MovieDetailsData

		let posterIMG = 'https://image.tmdb.org/t/p/w500/y5vVYKrcXtlrBEPMasHvxsIVoSI.jpg', //'https://image.tmdb.org/t/p/w500' + data.poster,
			backdropIMG = 'https://image.tmdb.org/t/p/original' + data.backdrop,
			overview = 'overview of the movie', //data.overview
			title = 'movie title'; //data.title

				// <div class={data.classname + ' poster-container'}>
				// 	<img id={'poster' + data.id} class={data.classname + ' poster'} src={posterIMG}></img>
				// </div>
		return (
			<div id={'row' + data.id} ref={'row' + data.id} className={data.classname}>
			</div>
		);
	}
  }

export default MovieDetails;
