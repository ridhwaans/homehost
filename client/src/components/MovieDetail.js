import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import CellDetail from './CellDetail'
import style from '../style/MovieDetail.css'

class MovieDetail extends CellDetail {
  
  render() {
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