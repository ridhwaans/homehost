import React, { useEffect, useState, useContext } from 'react';
import MusicRow from "../MusicRow/MusicRow";
import style from "./MusicHome.module.css"

const MusicHome = ({songs, albums, artists}) => {

    if (albums) {
        albums = albums.sort((a,b) => new Date(b.release_date) - new Date(a.release_date) );
    }
    if (songs) {
        songs = songs.sort((a,b) => new Date(b.mtime) - new Date(a.mtime) );
    }

    return (
        <React.Fragment>
        <div className={style.MusicHome}>
            <MusicRow mainTitle={"Recently Added Songs"} data={songs} music_type={"songs"}/>
            <MusicRow mainTitle={"Latest Album Releases"} data={albums} music_type={"albums"}/>
            <MusicRow mainTitle={"Artists"} data={artists} music_type={"artists"}/>
        </div>
        </React.Fragment>
    )

}
export default MusicHome;