import React from "react"
import AlbumItem from "../../Albums/AlbumItem/AlbumItem"
import style from "../../Albums/Albums.module.css"

const AlbumResults = ({albums}) => {
    return (
      <React.Fragment>
      
      <div className={style.Albums}>
        <h1 className={style.Title}>Albums</h1>

        <div className={style.Container}>
          {albums && albums.map(item => { return <AlbumItem key={item.id} album={item}/> }) }
        </div>
      </div>
      </React.Fragment>
    );
};

export default AlbumResults;