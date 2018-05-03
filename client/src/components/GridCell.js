import React from 'react'
import style from '../style/App.css'

class GridCell extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      type: this.props.type,
      gridCellData: JSON.parse(this.props.gridCellData)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ gridCellData: JSON.parse(nextProps.gridCellData) });  
  }

  cellClick(event) {
    this.props.handleCellClick(event)
  }

  render() {
    let cellWidth
    let cellHeight
    let cellTitle
    let cellSubtitle
    let cellBackground
    let cellData = this.state.gridCellData

    switch(this.state.type) {
      case type.MOVIES:
        cellWidth = 140
        cellHeight = 200
        cellTitle = cellData.title
        cellSubtitle = parseInt(cellData.release_date)
        cellBackground = cellData.poster_path
        break;
      case type.MUSIC:
        cellWidth = 175
        cellHeight = 175
        cellTitle = cellData.album_name
        cellSubtitle = parseInt(cellData.release_date)
        cellBackground = cellData.album_art
        break;
      case type.TV:
        cellWidth = 140
        cellHeight = 200
        cellTitle = cellData.name
        cellSubtitle = parseInt(cellData.air_date)
        cellBackground = cellData.season.poster_path
        break;
      default:
        break;
    }
            
    var cellStyle = {   
      backgroundImage: 'url(' + cellBackground + ')',
      backgroundSize: 'cover',
      width: cellWidth,
      height: cellHeight
    }

    // https://stackoverflow.com/questions/7993067/text-overflow-ellipsis-not-working/7993098#7993098
    var cellTitleStyle = {   
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: 'block',
      width: cellWidth
    }

    return (
      <div className={style.gridCellDiv} id={this.props.id}>
      <li className={style.gridCell} onClick={this.cellClick.bind(this)} style={cellStyle}> </li>
      </div>
    )
  }
 }

const type = {
  MOVIES: 0,
  MUSIC: 1,
  TV: 2,
  BOOKS: 3,
  COMICS: 4,
  PODCASTS: 5
}

export default GridCell
