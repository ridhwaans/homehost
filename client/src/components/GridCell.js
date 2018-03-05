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
    var backgroundImage = {   
      backgroundImage: 'url(' + this.props.GridCellData['img'] + ')'
    }

    return (
      <div className="grid-cell-div" id={this.props.id}>
      <li className="grid-cell" onClick={this.cellClick.bind(this)} style={backgroundImage}> </li>
      <h2 className="grid-cell-title"> {this.props.GridCellData['title']} </h2>
      </div>
    )
  }
 }

export default GridCell