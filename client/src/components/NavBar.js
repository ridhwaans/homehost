import React from 'react'
import {
  Collapse,	
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Input,
  InputGroup } from 'reactstrap';

class NavBar extends React.Component {

  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this);
    this.state = {
    	type: this.props.type,
    	isOpen: false
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
  	return (
  		<div>
        <Navbar color="dark" dark expand="md">
          <NavbarToggler onClick={this.toggle} />
          <NavbarBrand href="http://localhost:3000">HOMEHOST</NavbarBrand>
          <InputGroup>
	        	<Input 
            onChange={this.props.onChange}
            placeholder="Search..." 
            />
	      </InputGroup>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink className={(this.state.type === type.MOVIES) ? "active" : ""} href="/movies">Movies</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={(this.state.type === type.TV) ? "active" : ""} href="/tv">TV</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={(this.state.type === type.MUSIC) ? "active" : ""} href="/music">Music</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={(this.state.type === type.BOOKS) ? "active" : ""} href="/books">Books</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={(this.state.type === type.COMICS) ? "active" : ""} href="/comics">Comics</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={(this.state.type === type.PODCASTS) ? "active" : ""} href="/podcasts">Podcasts</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
		)
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

export default NavBar