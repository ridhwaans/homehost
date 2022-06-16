import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addManyAlbums, addManyArtists, addManySongs } from '../../store/slices/musicSlice';
import { getArtistsBy, getAlbumsBy, getSongsBy } from "../../api"
import MusicRow from "../MusicRow/MusicRow";
import style from "./MusicHome.module.css"

const MusicHome = () => {

    const [albums, setAlbums] = useState(null)
    const [artists, setArtists] = useState(null)
    const [songs, setSongs] = useState(null)

    const music = useSelector((state) => state.music);
    const dispatch = useDispatch()
    

    const fetchMusic = async () => {
        let albums = await getAlbumsBy("latest")
        let artists = await getArtistsBy("most_popular")
        let songs = await getSongsBy("recently_added")

        return { albums, artists, songs }
    }

    useEffect(() => {
        
        fetchMusic().then(response => {
            
          setAlbums(response.albums)
          setArtists(response.artists)
          setSongs(response.songs)
        
          dispatch(addManyAlbums(response.albums));
          dispatch(addManyArtists(response.artists));
          dispatch(addManySongs(response.songs));
          
          
        })
        return () => {
          setAlbums(null)
          setArtists(null)
          setSongs(null)
        }
    }, [])

    // console.log("music is")
    // console.log(music);

    return (
        <React.Fragment>
        <div className={style.MusicHome}>
            <MusicRow mainTitle={"Recently Added Songs"} data={songs} musicType={"songs"}/>
            <MusicRow mainTitle={"Latest Album Releases"} data={albums} musicType={"albums"}/>
            <MusicRow mainTitle={"Top Artists"} data={artists} musicType={"artists"}/>
        </div>
        </React.Fragment>
    )

}
export default MusicHome;