import React, { Component } from 'react'
import * as _ from 'lodash'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as musicActions from '../actions/MusicActions'

import NavBar from '../components/NavBar'
import ResultsBar from '../components/ResultsBar'
import Grid from '../components/Grid'
import FooterBar from '../components/FooterBar'

class Music extends Component {
  handleSearch(e) {
    this.props.musicActions.filterMusic(e.target.value)
  }

  componentDidMount() {
    this.props.musicActions.fetchMusic()
  }
  
  render() {
    let { displayedMusic } = this.props.musicReducer
    
    const artistCount = _.uniqBy(displayedMusic, 'artist_name').length
    const albumCount = displayedMusic.length
    var trackCount = 0;
    displayedMusic.forEach(function(album){
      trackCount = trackCount + album.tracks.items.length;
    });
    
    return (
      <div>
        <NavBar onChange={this.handleSearch.bind(this)} type={1}/>
        <br/>
        <ResultsBar count={[artistCount,albumCount,trackCount]} type={1}/>
        <Grid
          gridData={JSON.stringify(displayedMusic)}
          type={1}
        />
        <br/>
        <FooterBar/>
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

