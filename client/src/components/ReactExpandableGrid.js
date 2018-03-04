import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { Player } from 'video-react'
import ExpandedDetail from './ExpandedDetail'
import SingleGridCell from './SingleGridCell'

class ReactExpandableGrid extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      selected_element: '',
      gridData: JSON.parse(this.props.gridData)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ gridData: JSON.parse(nextProps.gridData) });  
  }

  makeItMobileFriendly () {
    var leftPanel = document.getElementById('ExpandedDetail_left')
    var rightPanel = document.getElementById('ExpandedDetail_right')
    if (window.innerWidth < this.props.show_mobile_style_from_width) {
      leftPanel.style.display = 'none'
      rightPanel.style.width = '100%'
    } else {
      leftPanel.style.display = 'block'
      leftPanel.style.width = this.props.ExpandedDetail_left_width
      rightPanel.style.width = this.props.ExpandedDetail_right_width
    }
  }

  componentWillMount () {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  componentWillUnmount () { }

  handleResize () {
    this.makeItMobileFriendly()
  }

  handleCellClick (event) {
      var element = event.target.parentNode.id.toString() // Get id of GridCell container

    this.setState({
      selected_element: element//{element}
    })
    
  }

  render () {
    var grid = []
    var gridData = this.state.gridData

    for (var i in gridData) {
      var thisUniqueKey = 'grid_cell_' + i.toString()
      grid.push(<SingleGridCell handleCellClick={this.handleCellClick.bind(this)} key={thisUniqueKey} id={thisUniqueKey} cellMargin={this.props.cellMargin} SingleGridCellData={gridData[i]} cellSize={this.props.cellSize} />)
    }

    var detailData = []
    if (this.state.selected_element) {
      detailData = this.state.gridData[parseInt(this.state.selected_element.substring(10))]
    }
    grid.push(
      <ExpandedDetail selected_element={this.state.selected_element} detailData={detailData}/>
    )

    var cssForGridDetailExpansion = {
      width: '100%',
      position: 'relative'
    }

    var cssForGridList = {
      listStyle: 'none',
      padding: 0,
      display: 'inline-block'
    }

    var cssForTheGridHolder = {
      width: '100%',
      backgroundColor: this.props.bgColor,
      margin: 0,
      textAlign: 'center'
    }

    var cssForSelectedArrow = {
      width: 0,
      height: 0,
      borderLeft: '20px solid transparent',
      borderRight: '20px solid transparent',
      borderBottom: '30px solid' + this.props.detailBackgroundColor,
      marginTop: this.props.cellSize,
      marginLeft: this.props.cellSize / 2 - 20,
      display: 'none'
    }

    return (
      <div id='GridDetailExpansion' style={cssForGridDetailExpansion}>
        <div id='theGridHolder' style={cssForTheGridHolder}>
          <ol id='gridList' style={cssForGridList}>
            {grid}
          </ol>
        </div>
        <div id='selected_arrow' style={cssForSelectedArrow} />
      </div>
    )
  }
}

ReactExpandableGrid.propTypes = {
  gridData: PropTypes.string,
  cellSize: PropTypes.number,
  cellMargin: PropTypes.number,
  bgColor: PropTypes.string,
  detailWidth: PropTypes.string, // in %
  detailHeight: PropTypes.number,
  detailBackgroundColor: PropTypes.string,
  ExpandedDetail_right_width: PropTypes.string, // in %
  ExpandedDetail_left_width: PropTypes.string, // in %
  ExpandedDetail_description_bgColor: PropTypes.string,
  ExpandedDetail_title_bgColor: PropTypes.string,
  ExpandedDetail_img_bgColor: PropTypes.string,
  ExpandedDetail_link_text: PropTypes.string,
  ExpandedDetail_font_color: PropTypes.string,
  ExpandedDetail_closeX_bool: PropTypes.bool,
  show_mobile_style_from_width: PropTypes.number
}

var data = [

]

ReactExpandableGrid.defaultProps = {
  gridData: JSON.stringify(data),
  cellSize: 250,
  cellMargin: 25,
  bgColor: '#f2f2f2',
  show_mobile_style_from_width: 600,
}

export default ReactExpandableGrid


