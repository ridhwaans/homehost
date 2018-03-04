import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { Player } from 'video-react'

// return (
//   <div className="PlayerDiv" style={ExpandedDetailPlayerDivStyle}>
//     <ReactPlayer
//       style={ExpandedDetailPlayerStyle}
//       url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
//       width='100%'
//       height='100%'
//     />
//   </div>
// )

// return (
//   <div className="ExpandedDetailPlayerDiv" style={ExpandedDetailPlayerDivStyle}>
//   <Player>
//     <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
//   </Player>
//   </div>
// )
    
class ExpandedDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selected_element: this.props.selected_element, //''
      detailData: this.props.detailData || [] //JSON.parse()
    }
  }

  componentDidUpdate (prevProps, prevState){
    var detail = document.getElementById('expandedDetailDiv')

    if (this.state.selected_element) {
      this.insertAdjacentExpandedDetail(this.state.selected_element)
      
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

  insertAdjacentExpandedDetail (selected_element) {

    var thisIdNumber = parseInt(selected_element.substring(10))

    var detail = document.getElementById('expandedDetailDiv')
    var ol = document.getElementById(selected_element).parentNode
    var lengthOfList = parseInt(ol.childNodes.length)
    var startingIndex = thisIdNumber + 1

    var insertedFlag = false

    ol.insertBefore(detail, ol.childNodes[lengthOfList])

    for (var i = startingIndex; i < lengthOfList; i++) {
      if (ol.childNodes[i].className === 'SingleGridCellDiv') {
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

  closeExpandedDetail () {
    this.setState({selected_element: ''})
  }

  render() {
    var cssforExpandedDetailDiv = {
      display: 'block'
    }

    var cssforExpandedDetail = {
      backgroundColor: this.props.detailBackgroundColor,
      height: this.props.detailHeight,
      position: 'relative',
      padding: '20px',
      transition: 'display 2s ease-in-out 0.5s'
    }

    var cssforExpandedDetailImage = {
      display: 'inline-block',
      maxWidth: this.props.ExpandedDetail_image_size,
      width: '100%',
      height: 'auto',
      align: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: 'auto',
      maxHeight:'100%'
    }

    var ExpandedDetailPlayerDivStyle = {
      position: 'relative',
      float: 'left',
      height: '60%',
      marginRight: '10px'
      //paddingTop: '56.25%' /* Player ratio: 100 / (1280 / 720) */ 
    }

    var ExpandedDetailPlayerStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '60%'
    }

    var cssforExpandedDetailTitle = {
      backgroundColor: this.props.ExpandedDetail_title_bgColor,
      width: '100%',
      height: 'auto',
      marginBottom: '15px'
    }

    var cssforExpandedDetailDescription = {
      backgroundColor: this.props.ExpandedDetail_description_bgColor,
      color: this.props.ExpandedDetail_font_color,
      width: 'auto%',
      height: '20%',
      marginRight: '30px',
      marginLeft: '30px',
      textAlign: 'justify'
    }

    var cssforExpandedDetailLeft
    var cssforExpandedDetailRight

    cssforExpandedDetailLeft = {
      width: this.props.ExpandedDetail_left_width,
      height: '100%',
      float: 'left',
      position: 'relative'
    }

    cssforExpandedDetailRight = {
      width: this.props.ExpandedDetail_right_width,
      height: '100%',
      float: 'right',
      position: 'relative',
      overflow: 'hidden'
    }

    var cssForDescriptionLink = {
      textDecoration: 'none',
      position: 'relative',
      float: 'bottom',
      bottom: 20,
      cursor: 'pointer'
    }

    var cssForImageLink = {
      cursor: 'pointer'
    }

    var cssforExpandedDetailClose = {
      position: 'relative',
      float: 'right',
      height: '60%',
      width: '10px',
      cursor: 'pointer',
      textDecoration: 'none'
    }

    var closeX
    if (this.props.ExpandedDetail_closeX_bool) {
      closeX = 'X'
    } else {
      closeX = ''
    }

    // Make Mobile Friendly
    if (window.innerWidth < this.props.show_mobile_style_from_width) {
      cssforExpandedDetailLeft = {
        width: '0%',
        height: '100%',
        float: 'left',
        position: 'relative',
        display: 'none'
      }

      cssforExpandedDetailRight = {
        width: '100%',
        height: '100%',
        float: 'right',
        position: 'relative'
      }
    }

   return (
      <div style={cssforExpandedDetailDiv} id='expandedDetailDiv'>
        <li style={cssforExpandedDetail} key='expandedDetail' id='expandedDetail'>
          <div id='ExpandedDetail_left'className='ExpandedDetail_left' style={cssforExpandedDetailLeft}>
            <a id='ExpandedDetailImageLink' style={cssForImageLink} href={this.state.detailData['link']}>
              <img id='ExpandedDetailImage' className='ExpandedDetailImage' style={cssforExpandedDetailImage} src={this.state.detailData['img']}/>
            </a>
          </div>
          <div id='ExpandedDetail_right' className='ExpandedDetail_right' style={cssforExpandedDetailRight}>
            <div id='ExpandedDetail_close' key='ExpandedDetail_close' style={cssforExpandedDetailClose} onClick={this.closeExpandedDetail.bind(this)}>{closeX}</div>
            <div className="ExpandedDetailPlayerDiv" style={ExpandedDetailPlayerDivStyle}>
              <ReactPlayer url={this.state.detailData['url_path']} className="ExpandedDetailPlayerStyle" style={ExpandedDetailPlayerStyle}/>
            </div>
            <div id='ExpandedDetailTitle' className='ExpandedDetailTitle' style={cssforExpandedDetailTitle}> {this.state.detailData['title']} </div>
            <div id='ExpandedDetailDescription' className='ExpandedDetailDescription' style={cssforExpandedDetailDescription}> {this.state.detailData['description']}</div>
            <a id='ExpandedDetailDescriptionLink' style={cssForDescriptionLink} href={this.state.detailData['link']}> → Link </a>
          </div>
        </li>
      </div>
    )

  }
}

ExpandedDetail.defaultProps = {
  detailWidth: '100%',
  detailHeight: 300,
  detailBackgroundColor: '#D9D9D9',
  ExpandedDetail_right_width: '60%',
  ExpandedDetail_left_width: '40%',
  ExpandedDetail_image_size: 300,
  ExpandedDetail_description_bgColor: '#D9D9D9',
  ExpandedDetail_title_bgColor: '#D9D9D9',
  ExpandedDetail_img_bgColor: '#D9D9D9',
  ExpandedDetail_link_text: '→ Link',
  ExpandedDetail_font_color: '#434343',
  ExpandedDetail_closeX_bool: true,
  show_mobile_style_from_width: 600,
}

export default ExpandedDetail