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
		return (
			<div id={data.id} ref={data.id} className={data.classname}>
			</div>
		);
	}
  }

export default MovieDetails;