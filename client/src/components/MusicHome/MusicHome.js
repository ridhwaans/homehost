import React, { useEffect, useState, useContext } from 'react';
import MusicRow from "../MusicRow/MusicRow";
import { getAllArtists, getAllAlbums } from "../../api"
import style from "./MusicHome.module.css"

const MusicHome = () => {

    const [albums, setAlbums] = useState(null)
    const [artists, setArtists] = useState(null)

    const fetchMusic = async () => {
        let albums = await getAllAlbums()
        let artists = await getAllArtists()

        return { albums, artists }
    }

    useEffect(() => {
        fetchMusic().then(response => {

            setAlbums(response.albums)
            setArtists(response.artists)
        })
        return () => {
            setAlbums(null)
            setArtists(null)
        }
    }, [])


    return (
        <React.Fragment>
        <div className={style.MusicHome}>
            <MusicRow mainTitle={"Albums"} data={albums} music_type={"albums"}/>
            <MusicRow mainTitle={"Artists"} data={artists} music_type={"artists"}/>
        </div>
        </React.Fragment>
    )

}
export default MusicHome;