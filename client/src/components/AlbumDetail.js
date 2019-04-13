import React from 'react'
import CellDetail from './CellDetail'
import style from '../style/AlbumDetail.css'
import '../style/node_modules.css'

import { PlayButton, PrevButton, NextButton, Progress, Timer, VolumeControl } from 'react-soundplayer/components'
import SoundCloudAudio from '../utils/soundcloud-audio'
import WithSoundCloudAudio from '../utils/with-soundcloud-audio'
import { AlbumColors, rgbToHex } from '../utils/albumcolors'
import * as utils from '../utils/utils.js'

/*
  SoundCloudAudio component state managed with global vars to avoid display toggling of CellDetail in componentDidUpdate()
*/
var scPlayer = new SoundCloudAudio()
var activeIndex

class AlbumDetail extends CellDetail {

  playTrackAtIndex(playlistIndex) {  
    let data = this.state.detailData
    activeIndex = playlistIndex
    scPlayer.play({ playlistIndex });

    document.getElementById(style.spotifyPreviewUrl)
      .innerHTML = data.tracks.items[activeIndex].external_urls.spotify
  }

  nextIndex() {
    let data = this.state.detailData
    
    if (activeIndex >= data.tracks.items.length - 1) {
      return;
    }

    if (activeIndex || activeIndex === 0) {
      activeIndex = activeIndex + 1
    }
    let playlistIndex = activeIndex
    scPlayer.play({ playlistIndex });
  }

  prevIndex() {
    let data = this.state.detailData
    
    if (activeIndex <= 0) {
      return;
    }

    if (activeIndex || activeIndex === 0) {
      activeIndex = activeIndex - 1
    }
    let playlistIndex = activeIndex
    scPlayer.play({ playlistIndex });
  }

  render() {
    let data = this.state.detailData
    var trackList = []
    if (data.album_art) {
      let albumColors = new AlbumColors(data.album_art)
      albumColors.getColors(function(colors) {
        document.documentElement.style.setProperty('--background-color', rgbToHex(colors[0]))
        document.documentElement.style.setProperty('--title-color', rgbToHex(colors[1]))
        document.documentElement.style.setProperty('--description-color', rgbToHex(colors[2]))
      });
      
      for (var i = 0; i < data.tracks.items.length; i++){
        let track_number = data.tracks.items[i].track_number
        let name = data.tracks.items[i].name
        let duration = Timer.prettyTime(data.tracks.items[i].duration_ms / 1000)
        trackList.push(
          <li><div class={style.plItem} onClick={this.playTrackAtIndex.bind(this, i)}>
          <span class={style.plNum}> {track_number} </span>
          <span class={style.plTitle}> {name} </span>
          <span class={style.plLength}> {duration} </span>
          </div></li>
        )
      }
    }

    activeIndex = 0
    var demo = document.getElementById(style.spotifyPreviewUrl)
    if (demo != null) demo.innerHTML = ''

    scPlayer.playlist(data, function (track) {});
    var MusicPlayer = WithSoundCloudAudio(props => {
      return (
        <div className='bg-darken-1 red mt1 mb3 rounded'>
          <div className='p2'>
            <div className='flex flex-center'>
              <h2 className='h4 flex-auto nowrap m0 semibold'>{data.artist_name}</h2>
              <Timer className='h6 mr1 regular' {...props} />
            </div>
            <h2 className='h2 nowrap caps mt0 mb2 semibold'>{data.album_name}</h2>
            <div className='flex flex-center'>

              <PrevButton
                className='flex-none h3 button button-narrow button-transparent button-grow rounded'
                onPrevClick={this.prevIndex.bind(this)} {...props}
              />
              <PlayButton 
                className='flex-none h2 button button-transparent button-grow rounded'
                {...props}
              />
              <NextButton
                className='flex-none h3 button button-narrow button-transparent button-grow rounded'
                onNextClick={this.nextIndex.bind(this)} {...props}
              />
              <VolumeControl
                className='flex flex-center mr2'
                buttonClassName='flex-none h4 button button-transparent button-grow rounded'
                {...props}
              />
              <Progress
                className='mt1 mb1 rounded'
                innerClassName='rounded-left'
                {...props}
              />

            </div>
          </div>
        </div>
      );
    });

    return (
      <div id='CellDetailDiv' className={style.cellDetailDiv}>
        <li id='CellDetail' key='CellDetail' className={style.cellDetail}>
          <div id='CellDetail_left'className={style.cellDetailLeft}>
            <img id='CellDetailImage' className={style.cellDetailImage} src={data.album_art}/>
          </div>
          <div id='CellDetail_right' className={style.cellDetailRight}>
            <div id='CellDetail_close' className={style.cellDetailClose} onClick={this.closeCellDetail.bind(this)}>&#10006;</div>
            <MusicPlayer soundCloudAudio={scPlayer}/>

            <div id={style.spotifyPreviewUrl}/>
            <div id={style.plWrap}>
              <ul id={style.plList}>
                {trackList}
              </ul>
            </div>
            <div id='CellDetailCopyright' className={style.cellDetailCopyright}>© {data.label} &#8226; {parseInt(data.release_date)}</div> 
          </div>
        </li>
      </div>
    )
  }

}

export default AlbumDetail