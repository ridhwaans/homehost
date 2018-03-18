import React from 'react'
import ReactDOM from 'react-dom'
import CellDetail from './CellDetail'
import style from '../style/MovieDetail.css'

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

    let data = this.state.detailData
    let title = data.title + ' (' + parseInt(data.release_date) + ')'
    document.documentElement.style.setProperty('--background-image', 'url(' + data.backdrop_path + ')')
    
    return (
      <div id='CellDetailDiv' className={style.cellDetailDiv}>
        <li id='CellDetail' key='CellDetail' className={style.cellDetail}>
          <div id='CellDetail_left'className={style.cellDetailLeft}>
            <a id='CellDetailImageLink' className={style.imageLink} href={data.link}>
              <img id='CellDetailImage' className={style.cellDetailImage} src={data.poster_path}/>
            </a>
          </div>
          <div id='CellDetail_right' className={style.cellDetailRight}>
            <div id='CellDetail_close' className={style.cellDetailClose} onClick={this.closeCellDetail.bind(this)}>&#10006;</div>
            <div id='cellDetailPlayerDiv' className={style.cellDetailPlayerDiv}>
                <video id='cellDetailPlayer' className={style.cellDetailPlayer} controls controlsList='nodownload'>
                  <source src={data.url_path} type='video/mp4'/>
                </video>
            </div>
            <div id='CellDetailTitle' className={style.cellDetailTitle}> {title} </div>
            <div id='CellDetailDescription' className={style.cellDetailDescription}> {data.overview}</div>
          </div>
        </li>
      </div>
    )

  }
}

export default MovieDetail