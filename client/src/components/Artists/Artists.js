import React from "react"
import { connect } from "react-redux";
import ArtistItem from "./ArtistItem/ArtistItem"
import style from "./Artists.module.css"

const Artists = ({artists}) => {
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

const mapStateToProps = (state) => {
    return { artists: state.artists.artists, };
};

export default connect(mapStateToProps)(Artists);