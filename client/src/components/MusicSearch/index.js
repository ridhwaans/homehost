import React, { useContext, useRef, useEffect, useState, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { searchMusicBy } from "../../api"
import useSWR from 'swr'
import { useDebounce } from "../../hooks/useDebounce"
import MusicRow from "../MusicRow/MusicRow";
import style from "../MusicHome/MusicHome.module.css"
import { useSharedState } from "../../hooks/useSharedState"
import { useGlobalContext } from '../../contexts/context'

const MusicSearch = () => {
    //const [searchInput, setSearchInput] = useSharedState('musicSearchInput')
    const { musicSearchInput, setMusicSearchInput } = useGlobalContext();

    const navigate = useNavigate()
    const location = useLocation()
    // const [songs, setSongs] = useState(null)
    // const [albums, setAlbums] = useState(null)
    // const [artists, setArtists] = useState(null)

    

    //const dInput = useDebounce(searchInput, 1000);

    const debouncedSearch = useDebounce(musicSearchInput, 1000);

    const { data } = useSWR(() => debouncedSearch ? `/listen/search?q=${debouncedSearch}` : null);

    // const fetchData = useCallback(async () => {
    //     return await searchMusicBy(dInput, null).then(response => {

    //         setSongs(response.results.songs)
    //         setAlbums(response.results.albums)
    //         setArtists(response.results.artists)

    //     })

    // }, [dInput]);

    // The below use effect will trigger when ever one of the following changes:
    //      - context.searchInput: When ever the current search value updates.
    //      - location.pathname: When ever the current route updates.
    //      - navigate: This will most likely never change for the lifetime of the app.
    useEffect(() => {
        let basePath = location.pathname;

        // As the available information does not pass a "Base Route" we must calculate it
        // from the available information. The current path may already be a search and
        // duplicate "/search/" appends could be added with out a small amount of pre-processing.
        const searchIndex = basePath.indexOf('/search/');

        console.log(`basePath is ${basePath}, searchIndex is ${searchIndex}, musicSearchInput is ${musicSearchInput}`)

        // Remove previous "/search/" if found.
        if (searchIndex >= 0) {
            basePath = basePath.substring(0, searchIndex);
        }

        // Calculate new path.
        const newPath = `${basePath}/search/${encodeURI(musicSearchInput)}`;

        // Check new path is indeed a new path.
        // This is to deal with the fact that location.pathname is a dependency of the useEffect
        // Changing the route with navigate.push will update the route causing this useEffect to
        // refire. If we continually push the calculated path onto the history even if it is the
        // same as the current path we would end up with a loop.
        if (newPath !== location.pathname) {
            navigate(newPath);
        }
        console.log(`basePath is ${basePath}, newPath is ${newPath}`)
    }, [debouncedSearch, location.pathname, navigate])

    // useEffect(() => {

    //     fetchData()

    //     return () => {
    //         setSongs(null)
    //         setAlbums(null)
    //         setArtists(null)
    //     }
    // }, [dInput])

    if (data && data.results) return (
        <React.Fragment>
        <div className={style.MusicHome}>
            <MusicRow mainTitle={"Songs"} data={data.results.songs} musicType={"songs"}/>
            <MusicRow mainTitle={"Albums"} data={data.results.albums} musicType={"albums"}/>
            <MusicRow mainTitle={"Artists"} data={data.results.artists} musicType={"artists"}/>
        </div>
        </React.Fragment>
    )

}

export default MusicSearch