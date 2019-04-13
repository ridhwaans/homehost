import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as moviesActions from '../actions/MoviesActions'
import * as musicActions from '../actions/MusicActions'
import * as tvActions from '../actions/TVActions'
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

  handleSortTV(e) {
    this.props.tvActions.sortTV(e.target.innerText)
  }

  render() {
  	var dropdown = []
    var results = ''
  	switch(this.state.type) {
      case type.MOVIES:
        dropdown.push(<DropdownItem onClick={this.handleSortMovies.bind(this)}>Alphabetical</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMovies.bind(this)}>Oldest</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMovies.bind(this)}>Newest</DropdownItem>)
        results = this.props.count + ' movies'
        break;
      case type.MUSIC:
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Album name</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Artist name</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Oldest</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortMusic.bind(this)}>Newest</DropdownItem>)
        results = this.props.count[0] + ' artists, ' + this.props.count[1] + ' albums, ' + this.props.count[2] + ' tracks' 
        break;
      case type.TV:
        dropdown.push(<DropdownItem onClick={this.handleSortTV.bind(this)}>Alphabetical</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortTV.bind(this)}>Oldest</DropdownItem>)
        dropdown.push(<DropdownItem onClick={this.handleSortTV.bind(this)}>Newest</DropdownItem>)
        results = this.props.count[0] + ' shows, ' + this.props.count[1] + ' seasons, ' + this.props.count[2] + ' episodes' 
        break;
      default:
        break;
      }

  	return (
    	<div>
    		<div className={style.resultsBarDiv}>
    		<h3>
    	    [NON-PROFIT DEMO PURPOSES ONLY] {results}
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
    musicActions: bindActionCreators(musicActions, dispatch),
    tvActions: bindActionCreators(tvActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsBar)