import React from "react"
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import ArtistItem from "./ArtistItem/ArtistItem"
import style from "./Artists.module.css"

const Artists = () => {
  const location = useLocation()
  const { data } = location.state

    return (
      <React.Fragment>
      
      <div className={style.Albums}>
        <h1 className={style.Title}>Artists</h1>

        <div className={style.Container}>
          {data && data.map(item => { return <ArtistItem key={item.id} artist={item}/> }) }
        </div>
      </div>
      </React.Fragment>
    );
};

// const mapStateToProps = (state) => {
//     return { artists: state.artists.artists, };
// };

export default Artists;