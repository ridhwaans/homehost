import React, { Component } from 'react'
import * as _ from 'lodash'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as tvActions from '../actions/TVActions'

import NavBar from '../components/NavBar'
import ResultsBar from '../components/ResultsBar'
import Grid from '../components/Grid'
import FooterBar from '../components/FooterBar'

class TV extends Component {
  handleSearch(e) {
    this.props.tvActions.fetchTV(e.target.value)
  }

  componentDidMount() {
    this.props.tvActions.fetchTV()
  }

  render() {
    let { displayedTV } = this.props.tvReducer

    const showCount = _.uniqBy(displayedTV, 'name').length
    const seasonCount = displayedTV.length
    var episodeCount = 0;
    // displayedTV.forEach(function(season){
    //   // season.episodes.forEach undefined
    //   season.episodes.forEach(function(episode){
    //     if (episode.url_path) episodeCount++;
    //   });
    // });

    return (
      <div>
        <NavBar onChange={this.handleSearch.bind(this)} type={2}/>
        <br/>
        <ResultsBar count={[showCount,seasonCount,episodeCount]} type={2}/>
        <Grid
          gridData={JSON.stringify(displayedTV)}
          gridCell_width={140}
          gridCell_height={200}
          type={2}
        />
        <br/>
        <FooterBar/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tvReducer: state.tvReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    tvActions: bindActionCreators(tvActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TV)
