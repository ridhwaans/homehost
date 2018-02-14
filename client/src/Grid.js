import React, { Component } from 'react';
import * as utils from './utils.js'

class Grid extends Component {
	state = {
		files: []
	};
	
	componentWillMount() {
		utils.callApi('/api/movies')
		.then(res => this.setState({ files: res.files })) //this.setState({ files: res.files })
		.catch(err => console.log(err));
	}

	render() {
		let items = this.state.files

	return ( //{this.state.response}
		<div>
		<ul>{items.map(item => 
			<li key={item}>{item}</li>
			)}
		</ul>
		</div>
		);
}
}

export default Grid;

//https://egghead.io/lessons/react-use-map-to-create-react-components-from-arrays-of-data