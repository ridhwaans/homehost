import React, { useContext, useRef, useEffect, useState, useCallback } from "react"
import { useHistory, useLocation } from "react-router-dom";
import musicSearchContext from "../MusicSearch/context"
import { searchMusicBy } from "../../api"
import { useDebounce } from "../../hooks/useDebounce"
import MusicRow from "../MusicRow/MusicRow";
import style from "../MusicHome/MusicHome.module.css"

const MusicSearch = () => {
    const context = useContext(musicSearchContext)
    const history = useHistory()
    const location = useLocation()
    const [songs, setSongs] = useState(null)
    const [albums, setAlbums] = useState(null)
    const [artists, setArtists] = useState(null)

    const dInput = useDebounce(context.searchInput, 1000);

    const fetchData = useCallback(async () => {
        return await searchMusicBy(dInput, null).then(response => {

            setSongs(response.results.songs)
            setAlbums(response.results.albums)
            setArtists(response.results.artists)

        })

    }, [dInput]);

    // The below use effect will trigger when ever one of the following changes:
    //      - context.searchInput: When ever the current search value updates.
    //      - location.pathname: When ever the current route updates.
    //      - history: This will most likely never change for the lifetime of the app.
    useEffect(() => {
        let basePath = location.pathname;

        // As the available information does not pass a "Base Route" we must calculate it
        // from the available information. The current path may already be a search and
        // duplicate "/search/" appends could be added with out a small amount of pre-processing.
        const searchIndex = basePath.indexOf('/search/');

        // Remove previous "/search/" if found.
        if (searchIndex >= 0) {
            basePath = basePath.substr(0, searchIndex);
        }

        // Calculate new path.
        const newPath = `${basePath}/search/${encodeURI(context.searchInput)}`;

        // Check new path is indeed a new path.
        // This is to deal with the fact that location.pathname is a dependency of the useEffect
        // Changing the route with history.push will update the route causing this useEffect to
        // refire. If we continually push the calculated path onto the history even if it is the
        // same as the current path we would end up with a loop.
        if (newPath !== location.pathname) {
            history.push(newPath);
        }
        console.log(`basePath is ${basePath}, newPath is ${newPath}`)
    }, [dInput, location.pathname, history])

    useEffect(() => {

        fetchData()

        return () => {
            setSongs(null)
            setAlbums(null)
            setArtists(null)
        }
    }, [dInput])

    return (
        <React.Fragment>
        <div className={style.MusicHome}>
            <MusicRow mainTitle={"Songs"} data={songs} music_type={"songs"}/>
            <MusicRow mainTitle={"Albums"} data={albums} music_type={"albums"}/>
            <MusicRow mainTitle={"Artists"} data={artists} music_type={"artists"}/>
        </div>
        </React.Fragment>
    )

}

export default MusicSearch