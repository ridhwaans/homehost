import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import style from '../style/App.css'

class CellDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selected_element: this.props.selected_element, //''
      detailData: this.props.detailData || [] //JSON.parse()
    }
  }

  componentDidUpdate (prevProps, prevState){
    var wrapper = document.getElementById('CellDetailDiv')
    //var detail = document.querySelector(style.cellDetail)
    var detail = document.getElementById('CellDetail')
    var arrow = document.getElementById('selected_arrow')

    if (this.state.selected_element && wrapper && detail) {
      if (this.props.selected_element === prevProps.selected_element) {
        wrapper.clientHeight ? wrapper.style.height = 0 : wrapper.style.height = detail.clientHeight + "px"
      } else {
        wrapper.style.height = 0
        this.insertAdjacentCellDetail(this.state.selected_element)
        wrapper.style.height = detail.clientHeight + "px"
      }

    } else {
      wrapper.style.height = 0
    }

    if (this.state.selected_element && document.getElementById('cellDetailPlayer')) {
      document.getElementById('cellDetailPlayer').load();
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({ selected_element: nextProps.selected_element, detailData: nextProps.detailData });  
  }

  insertAdjacentCellDetail (selected_element) {

    var thisIdNumber = parseInt(selected_element.substring(10))

    var wrapper = document.getElementById('CellDetailDiv')
    var ol = document.getElementById(selected_element).parentNode
    var lengthOfList = parseInt(ol.childNodes.length)
    var startingIndex = thisIdNumber + 1

    var insertedFlag = false

    ol.insertBefore(wrapper, ol.childNodes[lengthOfList])

    for (var i = startingIndex; i < lengthOfList; i++) {
      if (ol.childNodes[i].className === style.gridCellDiv) {
        if (ol.childNodes[i].offsetTop !== ol.childNodes[thisIdNumber].offsetTop) {
          ol.childNodes[i].insertAdjacentElement('beforebegin', wrapper)
          insertedFlag = true
          break
        }
      }
    }

    if (insertedFlag === false) {
      ol.childNodes[lengthOfList - 1].insertAdjacentElement('afterend', wrapper)
    }

  }

  closeCellDetail () {
    this.setState({selected_element: '', detailData: [] })
  }

  render() {
   return (<div/>)
  }
}

CellDetail.defaultProps = {
  CellDetail_closeX_bool: true,
  show_mobile_style_from_width: 600,
}

export default CellDetail