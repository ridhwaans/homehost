import React, { Component } from 'react';
import './stylesheet.css';
import * as utils from './utils.js'
import MovieItem from './MovieItem';
import MovieDetails from './MovieDetails';

class Grid extends Component {
	constructor(props) {
    super(props)

    this.state = {
      files: [],
      liClass: "grid-item grid-item--light",
      rowClass: "row"	
    }
  }

	handleClick(e){
    	console.log(e.target.id);
  }

	onItemClickHandler(event){
	    console.log("test");
	    this.setState({
	      condition: !this.state.condition
	    });
	    if (event.target.classList.contains('active')){ //this.myClass
	    	event.target.removeClass('active');
	    }
	    else {
	    	event.target.removeClass('active');
	    	event.target.getAttribute('data-link').addClass('active');
	    }
  	}

	componentWillMount() {
		utils.callApi('/api/movies')
		.then(response => {
		this.setState({ files: response });
		})
		.catch(err => console.log(err));
	}

	render() {
		let items = this.state.files,
		    listitems = [];

		for (var i = 0; i < items.length; i++) {
			let itemProps = {
				tmdb_id: items[i]["id"],
				imdb_id: items[i]["imdb_id"], 
				title: items[i]["title"],
				poster_path: "https://image.tmdb.org/t/p/w500" + items[i]["poster_path"],
				backdrop_path: "https://image.tmdb.org/t/p/original" + items[i]["backdrop_path"],
				file_path: items[i]["file_path"],
				release_date: items[i]["release_date"],
				runtime: items[i]["runtime"],
				revenue: items[i]["revenue"],
				file_path: items[i]["file_path"],
				overview: items[i]["overview"],
				tagline: items[i]["tagline"]
			};
			itemProps.id = i;
			listitems.push(<MovieItem MovieItemProps={itemProps}/>)
			let row_i = Math.floor(parseInt(i/12));
			if ((i+1) % 12 === 0) {
			    listitems.push(<MovieDetails MovieDetailsProps={{id: row_i}}/>)
			}
		}

	return ( //{this.state.response}
		<div>
		<ul className="grid">
		{listitems}	
		</ul>
		</div>
		);
	}
}

export default Grid;

//https://egghead.io/lessons/react-use-map-to-create-react-components-from-arrays-of-data

// {
// 			// for (var i = 0; i < items.length; i++) {
// 			// <li datalink={index} onClick={this.onItemClickHandler} className={this.state.textClass} key={item}>{index} {item}</li>
// 			// }
// 			items.map
// 			(
// 			(item,index) => 
// 			<li datalink={index} onClick={this.onItemClickHandler} className={this.state.textClass} key={item}>{index} {item}</li>
// 			)
// 		}