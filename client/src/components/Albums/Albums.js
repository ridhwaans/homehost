import React from "react"
import { connect } from "react-redux";
import AlbumItem from "./AlbumItem/AlbumItem"
import style from "./Albums.module.css"

const Albums = ({albums}) => {
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

const mapStateToProps = (state) => {
    return { albums: state.albums.albums, };
};

export default connect(mapStateToProps)(Albums);