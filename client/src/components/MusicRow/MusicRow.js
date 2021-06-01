import React, { useEffect, useRef, useState, useContext } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AlbumItem from "../Albums/AlbumItem/AlbumItem"
import ArtistItem from "../Artists/ArtistItem/ArtistItem"
import style from "./MusicRow.module.css"

const MusicRow = ({ mainTitle, data, music_type }) => {

    //console.log(`data is ${JSON.stringify(data)}`)
    return (
        <React.Fragment>
      
      <div className={style.MusicRow}>
        <div className={style.RowHeader}>
            <span className={style.Title}>{mainTitle}</span>
            <Link style={{ textDecoration: "none", color: "white" }} to={`/music/${music_type}`}>
                <span>SEE ALL</span>
            </Link>
        </div>

        <div className={style.Container}>
          {music_type === "albums" && data && data.map(item => { return <AlbumItem key={item.id} album={item}/> }) }
          {music_type === "artists" && data && data.map(item => { return <ArtistItem key={item.id} artist={item}/> }) }
        </div>
      </div>
      </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return { albums: state.albums.albums, };
};

export default connect(mapStateToProps)(MusicRow);