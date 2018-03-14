import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import GridCell from './GridCell'
import MovieDetail from './MovieDetail'
import AlbumDetail from './AlbumDetail'
import '../style/MovieDetail.css'
import '../style/AlbumDetail.css'

const SoundCloudAudio = require('soundcloud-audio');
const streamUrl='https://s3-eu-west-1.amazonaws.com/react-soundplayer-examples/ksmtk-reborn-edit.mp3'
const ksmtkChronemics = 'https://soundcloud.com/kosmetism/chronemics';
const clientId = '1f4ff48a42e78f1382d83d7d91cde4ec';

class Grid extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      selected_element: '',
      type: this.props.type,
      gridCell_width: this.props.gridCell_width,
      gridCell_height: this.props.gridCell_height,
      gridData: JSON.parse(this.props.gridData)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ gridData: JSON.parse(nextProps.gridData) });  
  }

  makeItMobileFriendly () {
    var leftPanel = document.getElementById('CellDetail_left')
    var rightPanel = document.getElementById('CellDetail_right')
    if (window.innerWidth < this.props.show_mobile_style_from_width) {
      leftPanel.style.display = 'none'
      rightPanel.style.width = '100%'
    } else {
      leftPanel.style.display = 'block'
      leftPanel.style.width = this.props.CellDetail_left_width
      rightPanel.style.width = this.props.CellDetail_right_width
    }
  }

  componentWillMount () {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  handleResize () {
    this.makeItMobileFriendly()
  }

  handleCellClick (event) {
    var element = event.target.parentNode.id.toString() // Get id of GridCell container

    this.setState({
      selected_element: element
    })
  }

  render () {
    var grid = []
    var gridData = this.state.gridData

    for (var i in gridData) {
      var gridCell = 'grid_cell_' + i.toString()
      grid.push(<GridCell 
        handleCellClick={this.handleCellClick.bind(this)} 
        id={gridCell}
        width={this.state.gridCell_width}
        height={this.state.gridCell_height}
        GridCellData={gridData[i]}/>)
    }

    var detailData = []
    if (this.state.selected_element) {
      detailData = this.state.gridData[parseInt(this.state.selected_element.substring(10))]
    }

    switch(this.state.type) {
      case type.MOVIES:
        grid.push(<MovieDetail selected_element={this.state.selected_element} detailData={detailData}/>)
        //change stylesheet
        break;
      case type.MUSIC:
        grid.push(<AlbumDetail selected_element={this.state.selected_element} detailData={detailData}/>)
        //change stylesheet
        break;
      default:
        break;
    }

// resolveUrl={ksmtkChronemics}
// soundCloudAudio = {new SoundCloudAudio(clientId)}
// playing = {false}
// currentTime={500}
// duration={800}
          
    return (
      <div id='GridDetailExpansion' className="grid-detail-expansion">
        <div id='theGridHolder' className="grid-holder">
          <ol id='gridList' className="grid-list">
            {grid}
          </ol>
        </div>
        <div id='selected_arrow' className="selected-arrow" />
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

Grid.propTypes = {
  gridData: PropTypes.string,
  show_mobile_style_from_width: PropTypes.number,
  CellDetail_right_width: PropTypes.string, // in %
  CellDetail_left_width: PropTypes.string // in %
}

var data = []

Grid.defaultProps = {
  gridData: JSON.stringify(data),
  show_mobile_style_from_width: 600,
  CellDetail_right_width: '60%',
  CellDetail_left_width: '40%'
}

export default Grid


