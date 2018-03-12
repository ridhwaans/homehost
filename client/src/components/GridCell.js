import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class GridCell extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      width: this.props.width,
      height: this.props.height
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ width: nextProps.width, height: nextProps.height });  
  }

  cellClick (event) {
    this.props.handleCellClick(event)
  }

  render () {
    let cellTitle = this.props.GridCellData['title'] // Movie 
            || this.props.GridCellData['album_name'] // Music

    let cellBackground = this.props.GridCellData['poster_path'] // Movie 
            || this.props.GridCellData['album_art'] // Music
            
    var cellStyle = {   
      backgroundImage: 'url(' + cellBackground + ')',
      backgroundSize: 'cover',
      width: this.props.width,
      height: this.props.height
    }

    return (
      <div className="grid-cell-div" id={this.props.id}>
      <li className="grid-cell" onClick={this.cellClick.bind(this)} style={cellStyle}> </li>
      <h2 className="grid-cell-title"> {cellTitle} </h2>
      </div>
    )
  }
 }

export default GridCell