import React from 'react'
import ReactDOM from 'react-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as moviesActions from '../actions/MoviesActions'
import * as musicActions from '../actions/MusicActions'

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import style from '../style/App.css'

class ResultsBar extends React.Component {
	constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      type: this.props.type,
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleSortMovies(e) {
    this.props.moviesActions.sortMovies(e.target.innerText)
  }

  handleSortMusic(e) {
    this.props.musicActions.sortMusic(e.target.innerText)
  }

  render() {
  	var dropdown = []
  	switch(this.state.type) {
      case type.MOVIES:
        dropdown.push(<DropdownItem onClick={this.handleSortMovies.bind(this)}>Alphabetical</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMovies.bind(this)}>Oldest</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMovies.bind(this)}>Newest</DropdownItem>)
        break;
      case type.MUSIC:
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Album name</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Artist name</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Oldest</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Newest</DropdownItem>)
        break;
      default:
        break;
      }

  	return (
    	<div>
    		<div className={style.resultsBarDiv}>
    		<h3>
    	    	{this.props.count || 0} results
    		</h3>
    		<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
    		<DropdownToggle caret>
    	  		Sort options
    		</DropdownToggle>
    		<DropdownMenu>
    	  		{dropdown}
    		</DropdownMenu>
    		</Dropdown>
    		</div>
    		<hr/>
    	</div>
  	);
  }
}

const type = {
  MOVIES: 0,
  MUSIC: 1,
  TV: 2,
  BOOKS: 3,
  COMICS: 4,
  PODCASTS: 5
}

function mapStateToProps(state) {
  return {
    active: state.active
  }
}

function mapDispatchToProps(dispatch) {
  return {
    moviesActions: bindActionCreators(moviesActions, dispatch),
    musicActions: bindActionCreators(musicActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsBar)