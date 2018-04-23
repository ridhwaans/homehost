import React from 'react'
import CellDetail from './CellDetail'
import style from '../style/SeasonDetail.css'

class SeasonDetail extends CellDetail {

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
    document.documentElement.style.setProperty('--background-image', 'url(' + data.backdrop_path + ')')
    // var episodeList = []
    // if (data.poster_path) {
      
    //   for (var i = 0; i < data.episodes.length; i++){
    //     let name = data.episodes[i].name
    //     let episode_number = data.episodes[i].episode_number

    //     episodeList.push(
    //       <li><div class={style.elItem}>
    //       <span class={style.elNum}> {episode_number} </span>
    //       <span class={style.elTitle}> {name} </span>
    //       </div></li>
    //     )
    //   }
    // }
    //{episodeList}
    //<div id='CellDetailCopyright' className={style.cellDetailCopyright}>© {data.networks[0].name} &#8226; {parseInt(data.air_date)}</div> 
    return (
      <div id='CellDetailDiv' className={style.cellDetailDiv}>
        <li id='CellDetail' key='CellDetail' className={style.cellDetail}>
          <div id='CellDetail_left'className={style.cellDetailLeft}>
            <img id='CellDetailImage' className={style.cellDetailImage} src={data.poster_path}/>
          </div>
          <div id='CellDetail_right' className={style.cellDetailRight}>
            <div id='CellDetail_close' className={style.cellDetailClose} onClick={this.closeCellDetail.bind(this)}>&#10006;</div>

            <div id={style.elWrap}>
              <ul id={style.elList}>
                
              </ul>
            </div>
            
          </div>
        </li>
      </div>
    )
  }

}

export default SeasonDetail