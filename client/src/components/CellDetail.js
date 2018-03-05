import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { Player } from 'video-react'

class CellDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selected_element: this.props.selected_element, //''
      detailData: this.props.detailData || [] //JSON.parse()
    }
  }

  componentDidUpdate (prevProps, prevState){
    var detail = document.getElementById('CellDetailDiv')

    if (this.state.selected_element) {
      this.insertAdjacentCellDetail(this.state.selected_element)
      
      if (this.state.selected_element === prevProps.selected_element) {
        detail.style.display == 'block' ? detail.style.display = 'none' : detail.style.display = 'block'
      } else {
        detail.style.display = 'block'
      }
      
    } else {
      detail.style.display = 'none'

      var arrow = document.getElementById('selected_arrow')
      arrow.style.display = 'none'
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({ selected_element: nextProps.selected_element, detailData: nextProps.detailData });  
  }

  insertAdjacentCellDetail (selected_element) {

    var thisIdNumber = parseInt(selected_element.substring(10))

    var detail = document.getElementById('CellDetailDiv')
    var ol = document.getElementById(selected_element).parentNode
    var lengthOfList = parseInt(ol.childNodes.length)
    var startingIndex = thisIdNumber + 1

    var insertedFlag = false

    ol.insertBefore(detail, ol.childNodes[lengthOfList])

    for (var i = startingIndex; i < lengthOfList; i++) {
      if (ol.childNodes[i].className === 'grid-cell-div') {
        if (ol.childNodes[i].offsetTop !== ol.childNodes[thisIdNumber].offsetTop) {
          ol.childNodes[i].insertAdjacentElement('beforebegin', detail)
          insertedFlag = true
          break
        }
      }
    }

    if (insertedFlag === false) {
      ol.childNodes[lengthOfList - 1].insertAdjacentElement('afterend', detail)
    }

    var cell = document.getElementById(selected_element)
    var arrow = document.getElementById('selected_arrow')
    cell.append(arrow)
    arrow.style.display = 'block'
  }

  closeCellDetail () {
    this.setState({selected_element: ''})
  }

  render() {
    // Make Mobile Friendly
    var cssforCellDetailLeft
    var cssforCellDetailRight
    if (window.innerWidth < this.props.show_mobile_style_from_width) {
      cssforCellDetailLeft = {
        width: '0%',
        height: '100%',
        float: 'left',
        position: 'relative',
        display: 'none'
      }

      cssforCellDetailRight = {
        width: '100%',
        height: '100%',
        float: 'right',
        position: 'relative'
      }
    }

    var backgroundImage = {   
      backgroundImage: 'url(' + this.props.detailData['backdrop_path'] + ')'
    }

   return (
      <div className="cell-detail-div" id='CellDetailDiv'>
        <li className="cell-detail" key='CellDetail' id='CellDetail' style={backgroundImage}>
          <div id='CellDetail_left'className='cell-detail-left'>
            <a id='CellDetailImageLink' className='image-link' href={this.state.detailData['link']}>
              <img id='CellDetailImage' className='cell-detail-image' src={this.state.detailData['img']}/>
            </a>
          </div>
          <div id='CellDetail_right' className='cell-detail-right'>
            <div id='CellDetail_close' className='cell-detail-close' onClick={this.closeCellDetail.bind(this)}>&#10006;</div>
            <div className="CellDetailPlayerDiv" className="cell-detail-player-div">
              <ReactPlayer url={this.state.detailData['url_path']} className="cell-detail-player"/>
            </div>
            <div id='CellDetailTitle' className='cell-detail-title'> {this.state.detailData['title']} </div>
            <div id='CellDetailDescription' className='cell-detail-description'> {this.state.detailData['description']}</div>
          </div>
        </li>
      </div>
    )

  //<a id='CellDetailDescriptionLink' className='description-link' href={this.state.detailData['link']}> → Link </a>
  }
}

CellDetail.defaultProps = {
  CellDetail_closeX_bool: true,
  show_mobile_style_from_width: 600,
}

export default CellDetail