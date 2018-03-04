/* eslint react/prop-types: 0 */
/* eslint react/jsx-no-bind: 0 */

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { Player } from 'video-react'
// import './../../node_modules/bootstrap/bootstrap.scss'
// import './../../index.css'

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

class ExpandedDetailPlayer extends React.Component {

  constructor (props) {
    super(props)

    this.state = {}
  }
  
  render () {
    var ExpandedDetailPlayerStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto'
    }

    return (
        <ReactPlayer url={this.props.src} className="ExpandedDetailPlayerStyle" style={ExpandedDetailPlayerStyle}/>
    )

  }
}

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
              <ExpandedDetailPlayer id='ExpandedDetailPlayer' src={this.state.detailData['url_path']}/>
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
{'img': 'http://i.imgur.com/zIEjP6Q.jpg', 'link': 'https://www.instagram.com/p/BRFjVZtgSJD/', 'title': 'Westland Tai Poutini National Park', 'description': 'Photo by @christopheviseux / The Westland Tai Poutini National Park in New Zealand’s South Island offers a remarkable opportunity to take a guided walk on a glacier. A helicopter drop high on the Franz Josef Glacier, provides access to explore stunning ice formations and blue ice caves. Follow me for more images around the world @christopheviseux #newzealand #mountain #ice'},
{'img': 'http://i.imgur.com/rCrvQTv.jpg', 'link': 'https://www.instagram.com/p/BQ6_Wa2gmdR/', 'title': 'Dubai Desert Conservation Reserve', 'description': 'Photo by @christopheviseux / Early morning flight on a hot air balloon ride above the Dubai Desert Conservation Reserve. Merely an hour drive from the city, the park was created to protect indigenous species and biodiversity. The Arabian Oryx, which was close to extinction, now has a population well over 100. There are many options to explore the desert and flying above may be one of the most mesmerizing ways. Follow me @christopheviseux for more images from the Middle East. #dubai #desert'},
{'img': 'http://i.imgur.com/U8iVzVl.jpg', 'link': 'https://www.instagram.com/p/BQyfDiKAEq9/', 'title': 'Crumbling Reflections', 'description': 'Photo @pedromcbride // Crumbling Reflections: Much has changed in Cuba over the 17 years I have visited this island. But much has stayed the same. Time still ticks at a Cuban pace and old cars still run… I don’t know how... and while pockets of new construction and renovation exist thanks to a growing tourism boom, most buildings are crumbling and cracking under the Caribbean climate. But amidst the hardship, nostalgia and messy vitality, the Cuban people keep moving, like their cars. And somehow, they do it with a colorful friendliness and warmth that always amazes me. To see more, follow @pedromcbride #cuba #havana #photo #workshop @natgeoexpeditions #reflection #photooftheday #petemcbride.'},
{'img': 'http://i.imgur.com/Ky9aJlE.jpg', 'link': 'https://www.instagram.com/p/BQxf6CEgD8p/', 'title': 'Impalas', 'description': 'Impetious young impala go head-to-head as they practice sparring. A talent they will need later in life when the rut begins. Photographed on assignment for @natgeotravel in Kruger National Park. For more images from Kruger, South Africa, follow @kengeiger #natgeotravel #krugernationalpark'},
{'img': 'http://i.imgur.com/mf3qfzt.jpg', 'link': 'https://www.instagram.com/p/BQvy7gbgynF/', 'title': 'Elephants', 'description': 'Photo by @ronan_donovan // Two bull African elephants at dawn in Uganda\'s Murchison Falls National Park. See more from Uganda with @ronan_donovan.'},
{'img': 'http://i.imgur.com/zIEjP6Q.jpg', 'link': 'https://www.instagram.com/p/BRFjVZtgSJD/', 'title': 'Westland Tai Poutini National Park', 'description': 'Photo by @christopheviseux / The Westland Tai Poutini National Park in New Zealand’s South Island offers a remarkable opportunity to take a guided walk on a glacier. A helicopter drop high on the Franz Josef Glacier, provides access to explore stunning ice formations and blue ice caves. Follow me for more images around the world @christopheviseux #newzealand #mountain #ice'},
{'img': 'http://i.imgur.com/rCrvQTv.jpg', 'link': 'https://www.instagram.com/p/BQ6_Wa2gmdR/', 'title': 'Dubai Desert Conservation Reserve', 'description': 'Photo by @christopheviseux / Early morning flight on a hot air balloon ride above the Dubai Desert Conservation Reserve. Merely an hour drive from the city, the park was created to protect indigenous species and biodiversity. The Arabian Oryx, which was close to extinction, now has a population well over 100. There are many options to explore the desert and flying above may be one of the most mesmerizing ways. Follow me @christopheviseux for more images from the Middle East. #dubai #desert'},
{'img': 'http://i.imgur.com/U8iVzVl.jpg', 'link': 'https://www.instagram.com/p/BQyfDiKAEq9/', 'title': 'Crumbling Reflections', 'description': 'Photo @pedromcbride // Crumbling Reflections: Much has changed in Cuba over the 17 years I have visited this island. But much has stayed the same. Time still ticks at a Cuban pace and old cars still run… I don’t know how... and while pockets of new construction and renovation exist thanks to a growing tourism boom, most buildings are crumbling and cracking under the Caribbean climate. But amidst the hardship, nostalgia and messy vitality, the Cuban people keep moving, like their cars. And somehow, they do it with a colorful friendliness and warmth that always amazes me. To see more, follow @pedromcbride #cuba #havana #photo #workshop @natgeoexpeditions #reflection #photooftheday #petemcbride.'},
{'img': 'http://i.imgur.com/Ky9aJlE.jpg', 'link': 'https://www.instagram.com/p/BQxf6CEgD8p/', 'title': 'Impalas', 'description': 'Impetious young impala go head-to-head as they practice sparring. A talent they will need later in life when the rut begins. Photographed on assignment for @natgeotravel in Kruger National Park. For more images from Kruger, South Africa, follow @kengeiger #natgeotravel #krugernationalpark'},
{'img': 'http://i.imgur.com/mf3qfzt.jpg', 'link': 'https://www.instagram.com/p/BQvy7gbgynF/', 'title': 'Elephants', 'description': 'Photo by @ronan_donovan // Two bull African elephants at dawn in Uganda\'s Murchison Falls National Park. See more from Uganda with @ronan_donovan.'},
{'img': 'http://i.imgur.com/zIEjP6Q.jpg', 'link': 'https://www.instagram.com/p/BRFjVZtgSJD/', 'title': 'Westland Tai Poutini National Park', 'description': 'Photo by @christopheviseux / The Westland Tai Poutini National Park in New Zealand’s South Island offers a remarkable opportunity to take a guided walk on a glacier. A helicopter drop high on the Franz Josef Glacier, provides access to explore stunning ice formations and blue ice caves. Follow me for more images around the world @christopheviseux #newzealand #mountain #ice'},
{'img': 'http://i.imgur.com/rCrvQTv.jpg', 'link': 'https://www.instagram.com/p/BQ6_Wa2gmdR/', 'title': 'Dubai Desert Conservation Reserve', 'description': 'Photo by @christopheviseux / Early morning flight on a hot air balloon ride above the Dubai Desert Conservation Reserve. Merely an hour drive from the city, the park was created to protect indigenous species and biodiversity. The Arabian Oryx, which was close to extinction, now has a population well over 100. There are many options to explore the desert and flying above may be one of the most mesmerizing ways. Follow me @christopheviseux for more images from the Middle East. #dubai #desert'},
{'img': 'http://i.imgur.com/rCrvQTv.jpg', 'link': 'https://www.instagram.com/p/BQ6_Wa2gmdR/', 'title': 'Dubai Desert Conservation Reserve', 'description': 'Photo by @christopheviseux / Early morning flight on a hot air balloon ride above the Dubai Desert Conservation Reserve. Merely an hour drive from the city, the park was created to protect indigenous species and biodiversity. The Arabian Oryx, which was close to extinction, now has a population well over 100. There are many options to explore the desert and flying above may be one of the most mesmerizing ways. Follow me @christopheviseux for more images from the Middle East. #dubai #desert'}
]

ReactExpandableGrid.defaultProps = {
  gridData: JSON.stringify(data),
  cellSize: 250,
  cellMargin: 25,
  bgColor: '#f2f2f2',
  show_mobile_style_from_width: 600,
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

export default ReactExpandableGrid