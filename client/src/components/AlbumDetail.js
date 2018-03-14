import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import CellDetail from './CellDetail'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { PlayButton, PrevButton, NextButton, Progress, Timer, VolumeControl, Icons } from 'react-soundplayer/components'
import { withCustomAudio } from 'react-soundplayer/addons'
import SoundCloudAudio from 'soundcloud-audio'
import { AlbumColors, rgbToHex } from '../utils/albumcolors'
import * as utils from '../utils/utils.js'

var MusicPlayer
var scPlayer = new SoundCloudAudio()
var activeIndex

class AlbumDetail extends CellDetail {
  constructor(props) {
    super(props)
    this.state = {
        detailData: this.props.detailData || []
    };
  }

  playTrackAtIndex(playlistIndex) {  
    if (playlistIndex == activeIndex)
      scPlayer.playing == false ? scPlayer.play({streamUrl: this.state.detailData.tracks.items[playlistIndex].preview_url}) : scPlayer.pause()
    else {
      scPlayer.play({streamUrl: this.state.detailData.tracks.items[playlistIndex].preview_url})
      activeIndex = playlistIndex
      }
    console.log(scPlayer.playing)
  }

  nextIndex() {
    if (activeIndex >= this.state.detailData.tracks.items.length - 1) {
      return;
    }

    if (activeIndex || activeIndex === 0) {
      activeIndex = activeIndex + 1
      scPlayer.play({streamUrl: this.state.detailData.tracks.items[activeIndex].preview_url});
    }
  }

  prevIndex() {
    if (activeIndex <= 0) {
      return;
    }

    if (activeIndex || activeIndex === 0) {
      activeIndex = activeIndex - 1
      scPlayer.play({streamUrl: this.state.detailData.tracks.items[activeIndex].preview_url});
    }
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

    activeIndex = 0
    let data = this.state.detailData
    var trackList = []
    var streamUrl
    if (data.album_art) {
      let cssAlbumDetail = document.documentElement.style;
      let albumColors = new AlbumColors(data.album_art); 
      albumColors.getColors(function(colors) {
      cssAlbumDetail.setProperty('--background-color', rgbToHex(colors[0]));
      cssAlbumDetail.setProperty('--title-color', rgbToHex(colors[1]));
      cssAlbumDetail.setProperty('--description-color', rgbToHex(colors[2]));
      });

      streamUrl = data.tracks.items[activeIndex].preview_url
      console.log('activeIndex ' + activeIndex)
      console.log('streamUrl ' + streamUrl)

      for (var i = 0; i < data.tracks.items.length; i++){
        let track_number = data.tracks.items[i].track_number
        let name = data.tracks.items[i].name
        let duration = utils.msToMS(data.tracks.items[i].duration_ms)
        let preview_url = data.tracks.items[i].preview_url

        trackList.push(
          <li><div onClick={this.playTrackAtIndex.bind(this, i)} class="plItem">
          <span class="plNum"> {track_number} </span>
          <span class="plTitle"> {name} </span>
          <span class="plLength"> {duration} </span>
          </div></li>
        )
      }
    }
    
    MusicPlayer = withCustomAudio(props => {
      //console.log(props)
      return (
        <div class="bg-darken-1 red mt1 mb3 rounded">
          <div className="p2">
            <div className="flex flex-center">
              <h2 className="h4 flex-auto nowrap m0 semibold">{data.artist_name}</h2>
              <Timer className="h6 mr1 regular" {...props} />
            </div>
            <h2 className="h2 nowrap caps mt0 mb2 semibold">{data.album_name}</h2>
            <div className="flex flex-center">

             <div onClick={this.prevIndex.bind(this)}>
              <PrevButton
                className="flex-none h3 button button-narrow button-transparent button-grow rounded"
                {...props}
              />
              </div>

              <div onClick={this.playTrackAtIndex.bind(this, activeIndex)}>
              <PlayButton 
                className="flex-none h2 button button-transparent button-grow rounded" 
                {...props}
              />
              </div>

              <div onClick={this.nextIndex.bind(this)}>
              <NextButton
                className="flex-none h3 button button-narrow button-transparent button-grow rounded"
                {...props}
              />
              </div>

              <VolumeControl
                className='flex flex-center mr2'
                buttonClassName="flex-none h4 button button-transparent button-grow rounded" 
                {...props}
              />

              <Progress
                className="mt1 mb1 rounded"
                innerClassName="rounded-left"
                {...props}
              />

            </div>
          </div>
        </div>
      );
    });
    //this.props.streamUrl streamUrl={streamUrl} 
    let title = data.album_name + ' (' + parseInt(data.release_date) + ')'
    return (
      <div className="cell-detail-div" id='CellDetailDiv'>
        <li className="cell-detail" key='CellDetail' id='CellDetail'>
          <div id='CellDetail_left'className='cell-detail-left'>
            <img id='CellDetailImage' className='cell-detail-image' src={data.album_art}/>
            
          </div>
          <div id='CellDetail_right' className='cell-detail-right'>
            <div id='CellDetail_close' className='cell-detail-close' onClick={this.closeCellDetail.bind(this)}>&#10006;</div>

            <MusicPlayer soundCloudAudio={scPlayer}/>

            <div id="plwrap">
              <ul id="plList">
                {trackList}
              </ul>
            </div>
            <div id='CellDetailCopyright' className='cell-detail-copyright'>© {data.label} &#8226; {parseInt(data.release_date)}</div> 
          </div>
        </li>
      </div>
    )
  }

}

export default AlbumDetail