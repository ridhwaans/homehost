import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { Player } from 'video-react'

class SingleGridCell extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      selected_id: '',
      window_width: window.innerWidth
    }
  }

  cellClick (event) {
    this.props.handleCellClick(event)
  }

  render () {
    var SingleGridCellStyle = {
      background: 'url(' + this.props.SingleGridCellData['img'] + ') no-repeat center center',
      backgroundSize: this.props.cellSize,
      width: this.props.cellSize,
      height: this.props.cellSize,
      display: 'inline-block',
      margin: 0,
      marginBottom: 0,
      position: 'relative'
    }
    var SingleGridCellTitleStyle = {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: '1rem',
      margin: 0
    }
    var SingleGridCellDivStyle = {
      width: this.props.cellSize,
      height: this.props.cellSize,
      display: 'inline-block',
      margin: this.props.cellMargin,
      marginBottom: 25
    }

    return (
      <div className='SingleGridCellDiv' style={SingleGridCellDivStyle} id={this.props.id}>
      <li className='SingleGridCell' style={SingleGridCellStyle}  onClick={this.cellClick.bind(this)}> </li>
      <h2 style={SingleGridCellTitleStyle}> {this.props.SingleGridCellData['title']} </h2>
      </div>
    )
  }
 }

export default SingleGridCell