import React from 'react'
import ReactDOM from 'react-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import style from '../style/App.css'

class ResultsBar extends React.Component {
	constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      type: this.props.type,
      count: this.props.count || 0,
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
	var dropdown = []
	switch(this.state.type) {
      case type.MOVIES:
        dropdown.push(<DropdownItem>Alphabetical</DropdownItem>)
        dropdown.push(<DropdownItem>Oldest</DropdownItem>)
        dropdown.push(<DropdownItem>Newest</DropdownItem>)
        break;
      case type.MUSIC:
        dropdown.push(<DropdownItem>Alphabetical</DropdownItem>)
        dropdown.push(<DropdownItem>Artist name</DropdownItem>)
        dropdown.push(<DropdownItem>Oldest</DropdownItem>)
        dropdown.push(<DropdownItem>Newest</DropdownItem>)
        break;
      default:
        break;
    }

	return (
	<div>
		<div className={style.resultsBarDiv}>
		<h3>
	    	{this.state.count} results
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

export default ResultsBar