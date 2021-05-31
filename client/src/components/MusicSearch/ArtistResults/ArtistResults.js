import React from "react"
import ArtistItem from "../../Artists/ArtistItem/ArtistItem"
import style from "../../Artists/Artists.module.css"

const ArtistResults = ({artists}) => {
    return (
      <React.Fragment>
      
      <div className={style.Albums}>
        <h1 className={style.Title}>Artists</h1>

        <div className={style.Container}>
          {artists && artists.map(item => { return <ArtistItem key={item.id} artist={item}/> }) }
        </div>
      </div>
      </React.Fragment>
    );
};

export default ArtistResults;