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
  InputGroup } from 'reactstrap'
import style from '../style/App.css'

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
          <NavbarBrand href={window.location.origin} className={style.navBarBrand}>HOMEHOST</NavbarBrand>
          <InputGroup hidden={this.state.type === -1}>
	        	<Input 
            onChange={this.props.onChange}
            placeholder="Search..." 
            />
	        </InputGroup>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink active={this.state.type === type.MOVIES} href="/movies">Movies</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.type === type.TV} href="/tv">TV</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.type === type.MUSIC} href="/music">Music</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.type === type.BOOKS} href="/books">Books</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.type === type.COMICS} href="/comics">Comics</NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.type === type.PODCASTS} href="/podcasts">Podcasts</NavLink>
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