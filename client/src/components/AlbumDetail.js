import React from 'react'
import ReactDOM from 'react-dom'
import CellDetail from './CellDetail'
import '../style/AlbumDetail.css'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import {AlbumColors, rgbToHex} from '../utils/albumcolors'
import * as utils from '../utils/utils.js'

class AlbumDetail extends CellDetail {
  constructor(props) {
    super(props)
    this.state = {
        selected_element: this.props.selected_element,
        detailData: this.props.detailData || [],
        colors: []
    };
  }

  render() {
    let data = this.state.detailData

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

    let colors = []
    var trackList = []
    var cssAlbumDetail = document.documentElement.style;

    if (data.album_art) {
      let albumColors = new AlbumColors(data.album_art); 
      albumColors.getColors(function(colors) {
      cssAlbumDetail.setProperty('--background-color', rgbToHex(colors[0]));
      cssAlbumDetail.setProperty('--title-color', rgbToHex(colors[1]));
      cssAlbumDetail.setProperty('--description-color', rgbToHex(colors[2]));
      });


      for (var i = 0; i < data.tracks.items.length; i++){
        let track_number = data.tracks.items[i].track_number
        let name = data.tracks.items[i].name
        let duration = utils.msToMS(data.tracks.items[i].duration_ms)
        console.log(data.tracks.items[i].name)

        trackList.push(
          <li><div class="plItem"><span class="plNum"> {track_number} </span><span class="plTitle"> {name} </span><span class="plLength"> {duration} </span></div></li>
        )
      }
    }

    let title = data.album_name + ' (' + parseInt(data.release_date) + ')'
    let description = data.artist_name + '&#8226;' + data.label
    return (
      <div className="cell-detail-div" id='CellDetailDiv'>
        <li className="cell-detail" key='CellDetail' id='CellDetail'>
          <div id='CellDetail_left'className='cell-detail-left'>
            <img id='CellDetailImage' className='cell-detail-image' src={data.album_art}/>
            <div id='CellDetailTitle' className='cell-detail-title'> {title} </div>
            <div id='CellDetailDescription' className='cell-detail-description'> {data.artist_name} &#8226; {data.label} </div>
          </div>
          <div id='CellDetail_right' className='cell-detail-right'>
            <div id='CellDetail_close' className='cell-detail-close' onClick={this.closeCellDetail.bind(this)}>&#10006;</div>
            <div id="plwrap">
                <ul id="plList">
                {trackList}
                </ul>
            </div>
          </div>
        </li>
      </div>
    )
  }

}

export default AlbumDetail