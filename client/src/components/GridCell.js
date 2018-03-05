import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class GridCell extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      selected_id: ''
    }
  }

  cellClick (event) {
    this.props.handleCellClick(event)
  }

  render () {
    var GridCellStyle = {
      background: 'url(' + this.props.GridCellData['img'] + ') no-repeat center center',
      backgroundSize: this.props.cellSize,
      width: this.props.cellSize,
      height: this.props.cellSize,
      display: 'inline-block',
      margin: 0,
      marginBottom: 0,
      position: 'relative'
    }
    var GridCellTitleStyle = {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: '1rem',
      margin: 0
    }

    return (
      <div className="grid-cell-div" id={this.props.id}>
      <li className="grid-cell" onClick={this.cellClick.bind(this)}> </li>
      <h2 className="grid-cell-title"> {this.props.GridCellData['title']} </h2>
      </div>
    )
  }
 }

export default GridCell