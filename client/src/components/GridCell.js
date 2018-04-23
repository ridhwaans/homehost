import React from 'react'
import style from '../style/App.css'

class GridCell extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      width: this.props.width,
      height: this.props.height
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ width: nextProps.width, height: nextProps.height });  
  }

  cellClick(event) {
    this.props.handleCellClick(event)
  }

  render() {
    let cellTitle = this.props.gridCellData.title // Movie 
            || this.props.gridCellData.album_name // Music
            || this.props.gridCellData.name // TV

    let cellSubtitle = parseInt(this.props.gridCellData.release_date) // Movie & Music
            || parseInt(this.props.gridCellData.air_date) // TV

    let cellBackground = this.props.gridCellData.poster_path // Movie & TV
            || this.props.gridCellData.album_art // Music
            
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
      </div>
    )
  }
 }

export default GridCell