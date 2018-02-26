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
		let items = this.state.files

		var listitems = [];
		for (var i = 0; i < items.length; i++) {
			//listitems.push(<li onClick={this.handleClick.bind(this)} className={this.state.liClass} id={i}>{i} {items[i]}</li>);
			listitems.push(<MovieItem MovieItemProps={{ id: i, filename: items[i]["original_title"], fileposter: "https://image.tmdb.org/t/p/w500" + items[i]["poster_path"] }}/>)
			let id = Math.floor(parseInt(i/12));
			if ((i+1) % 12 === 0) {
			    //listitems.push(<div id={'row' + ((i+1)/4 - 1)} className={this.state.rowClass}></div>); //key={'row' + ((i+1)/4 - 1)}
			    listitems.push(<MovieDetails MovieDetailsProps={{ id: id, classname: this.state.rowClass }}/>)
			}
		    // note: we add a key prop here to allow react to uniquely identify each
		    // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
		    //rows.push(<li datalink={i} onClick={this.onItemClickHandler} className={this.state.textClass} key={items[i]}>{i} {items[i]}</li>);
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