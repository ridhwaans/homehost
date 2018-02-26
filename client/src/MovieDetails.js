import React, { Component } from 'react';
import './stylesheet.css';
import * as utils from './utils.js'
import MovieItem from './MovieItem';
import ReactPlayer from 'react-player'

class MovieDetails extends Component {
	constructor(props) {
    super(props)

    this.state = {
      classname: "row"
    }
  }

  render() {
		let data = this.props.MovieDetailsProps

				// <div class={data.classname + ' poster-container'}>
				// 	<img id={'poster' + data.id} class={data.classname + ' poster'} src={posterIMG}></img>
				// </div>
		return (
			<div id={'row' + data.id} ref={'row' + data.id} className={this.state.classname}>
			</div>
		);
	}
  }

export default MovieDetails;
