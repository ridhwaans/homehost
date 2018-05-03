import React from 'react'
import PropTypes from 'prop-types'
import GridCell from './GridCell'
import MovieDetail from './MovieDetail'
import AlbumDetail from './AlbumDetail'
import SeasonDetail from './SeasonDetail'
import style from '../style/App.css'

class Grid extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      selected_element: '',
      type: this.props.type,
      gridData: JSON.parse(this.props.gridData)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ gridData: JSON.parse(nextProps.gridData) });  
  }

  componentWillMount () {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  handleResize () {
    // TODO
  }

  handleCellClick (event) {
    var element = event.target.parentNode.id.toString() // Get id of GridCell container

    this.setState({
      selected_element: element
    })
  }

  render () {
    let gridData = this.state.gridData
    var grid = []

    for (var i in gridData) {
      var gridCell_id = 'grid_cell_' + i.toString()
      grid.push(<GridCell 
        id={gridCell_id}
        handleCellClick={this.handleCellClick.bind(this)}
        gridCellData={JSON.stringify(gridData[i])}
        type={this.state.type}/>)
    }

    var detailData = []
    if (this.state.selected_element) {
      detailData = this.state.gridData[parseInt(this.state.selected_element.substring(10))]
    }

    switch(this.state.type) {
      case type.MOVIES:
        grid.push(<MovieDetail selected_element={this.state.selected_element} detailData={detailData}/>)
        break;
      case type.MUSIC:
        grid.push(<AlbumDetail selected_element={this.state.selected_element} detailData={detailData}/>)
        break;
      case type.TV:
        grid.push(<SeasonDetail selected_element={this.state.selected_element} detailData={detailData}/>)
        break;
      default:
        break;
    }
          
    return (
      <div id='GridDetailExpansion' className={style.gridDetailExpansion}>
        <div id='theGridHolder' className={style.gridHolder}>
          <ol id='gridList' className={style.gridList}>
            {grid}
          </ol>
        </div>
        <div id='selected_arrow' className={style.selectedArrow}/>
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
  gridData: PropTypes.string
}

Grid.defaultProps = {
  gridData: JSON.stringify([])
}

export default Grid
