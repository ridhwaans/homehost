import React from 'react'
import ReactDOM from 'react-dom'
import style from '../style/App.css'

class GridCell extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      width: this.props.width,
      height: this.props.height
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ width: nextProps.width, height: nextProps.height });  
  }

  cellClick (event) {
    this.props.handleCellClick(event)
  }

  render () {
    let cellTitle = this.props.GridCellData.title // Movie 
            || this.props.GridCellData.album_name // Music

    let cellSubtitle = parseInt(this.props.GridCellData.release_date) // Movie & Music

    let cellBackground = this.props.GridCellData.poster_path // Movie 
            || this.props.GridCellData.album_art // Music
            
    var cellStyle = {   
      backgroundImage: 'url(' + cellBackground + ')',
      backgroundSize: 'cover',
      width: this.props.width,
      height: this.props.height
    }

    // https://stackoverflow.com/questions/7993067/text-overflow-ellipsis-not-working/7993098#7993098
    var cellTitleStyle = {   
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: 'block',
      width: this.props.width
    }

    return (
      <div className={style.gridCellDiv} id={this.props.id}>
      <li className={style.gridCell} onClick={this.cellClick.bind(this)} style={cellStyle}> </li>
      <h2 className={style.gridCellTitle} style={cellTitleStyle}> {cellTitle} </h2>
      <h2 className={style.gridCellSubtitle}> {cellSubtitle} </h2>
      </div>
    )
  }
 }

export default GridCell