import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addManyAlbums, addManyArtists, addManySongs } from '../../store/slices/musicSlice';
import { getArtistsBy, getAlbumsBy, getSongsBy } from "../../api"
import MusicRow from "../MusicRow/MusicRow";
import style from "./MusicHome.module.css"

const musicFromLocalStorage = JSON.parse(localStorage.getItem('music') || '[]')

const MusicHome = () => {

    const [music, setMusic] = useState(musicFromLocalStorage)

    //const music = useSelector((state) => state.music);
    const dispatch = useDispatch()
    

    const fetchMusic = async () => {
        let albums = await getAlbumsBy("latest")
        let artists = await getArtistsBy("most_popular")
        let songs = await getSongsBy("recently_added")

        return { albums, artists, songs }
    }

    useEffect(() => {
        localStorage.setItem('music', JSON.stringify(music))
    }, [music])

    useEffect(() => {
        fetchMusic().then(response => {
            setMusic(response)
        })
        return () => {
          setMusic(null)
        }
    }, [])

    // console.log("music is")
    // console.log(music);

    return (
        <React.Fragment>
        <div className={style.MusicHome}>
            {music && (<MusicRow mainTitle={"Recently Added Songs"} data={music.songs} musicType={"songs"}/>)}
            {music && (<MusicRow mainTitle={"Latest Album Releases"} data={music.albums} musicType={"albums"}/>)}
            {music && (<MusicRow mainTitle={"Top Artists"} data={music.artists} musicType={"artists"}/>)}
        </div>
        </React.Fragment>
    )

}
export default MusicHome;