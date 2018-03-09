import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { Player } from 'video-react'
import CellDetail from './CellDetail'

class MovieDetail extends CellDetail {
  
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
      backgroundImage: 'url(' + this.state.detailData['backdrop_path'] + ')'
    }
    var title = this.state.detailData['title'] + ' (' + parseInt(this.state.detailData['release_date']) + ')'

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
            <div id="cellDetailPlayerDiv" className="cell-detail-player-div">
                <video id="cellDetailPlayer" className="cell-detail-player" controls controlsList="nodownload">
                  <source src={this.state.detailData['url_path']} type="video/mp4"/>
                </video>
            </div>
            <div id='CellDetailTitle' className='cell-detail-title'> {title} </div>
            <div id='CellDetailDescription' className='cell-detail-description'> {this.state.detailData['description']}</div>
          </div>
        </li>
      </div>
    )
     //<a id='CellDetailDescriptionLink' className='description-link' href={this.state.detailData['link']}> → Link </a>
  }
}

export default MovieDetail