import React, { Component } from 'react';
import './stylesheet.css';
import * as utils from './utils.js'
import MovieItem from './MovieItem';
import ReactPlayer from 'react-player'

class MovieDetails extends Component {
	constructor(props) {
    super(props)

    this.state = {
      rowClass: "row",
      imgClass: "row"
    }
  }

  render() {
		let data = this.props.MovieDetailsProps

		return (
			<div id={'row' + data.id} ref={'row' + data.id} class={this.state.rowClass}>
			</div>
		);
	}
  }

export default MovieDetails;
