import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as musicActions from '../actions/MusicActions'

import NavBar from '../components/NavBar'
import ResultsBar from '../components/ResultsBar'
import Grid from '../components/Grid'
import * as utils from '../utils/utils.js'
import style from '../style/App.css'

class Music extends Component {

  handleSearch(e) {
    this.props.musicActions.filterMusic(e.target.value)
  }

  componentDidMount() {
    this.props.musicActions.fetchMusic()
  }
  
  render() {
    let { displayedMusic } = this.props.musicReducer

    return (
      <div>
      <NavBar onChange={this.handleSearch.bind(this)} type={1}/>
      <br/>
      <ResultsBar count={displayedMusic.length} type={1}/>
      <Grid
        gridData={JSON.stringify(displayedMusic)}
        gridCell_width={175}
        gridCell_height={175}
        type={1}
      />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    musicReducer: state.musicReducer
  } 
}

function mapDispatchToProps(dispatch) {
  return {
    musicActions: bindActionCreators(musicActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Music)

