import React from 'react'
import CellDetail from './CellDetail'
import { Container, Row, Col, Button } from 'reactstrap';
import style from '../style/SeasonDetail.css'

class SeasonDetail extends CellDetail {

  render() {
    let data = this.state.detailData
    document.documentElement.style.setProperty('--background-image', 'url(' + data.backdrop_path + ')')

    var container 
    if (data.name) {
      container = (
      <Container>
        <Row>
          <Col>{data.name + ': ' + data.season.name}</Col>
        </Row>
        <Row>
          <Col>{data.season.overview}</Col>
        </Row>
        <Row>
          <Col>{'Air date: ' + data.season.air_date}</Col>
          <Col>{'Episode count: ' + data.season.episode_count}</Col>
        </Row>
        <Row>
          <Col xs="6" sm="4">
            <Button color="primary">Show Details</Button>
          </Col>
          <Col xs="6" sm="4"></Col>
          <Col sm="4">
            <Button color="primary">View Episodes</Button>
          </Col>
        </Row>
      </Container>)
    }

    return (
      <div id='CellDetailDiv' className={style.cellDetailDiv}>
        <li id='CellDetail' key='CellDetail' className={style.cellDetail}>
          <div id='CellDetail_left'className={style.cellDetailLeft}>
            <img id='CellDetailImage' className={style.cellDetailImage} src={data.poster_path || ''}/>
          </div>
          <div id='CellDetail_right' className={style.cellDetailRight}>
            <div id='CellDetail_close' className={style.cellDetailClose} onClick={this.closeCellDetail.bind(this)}>&#10006;</div>
            {container}
          </div>
        </li>
      </div>
    )
  }

}

export default SeasonDetail