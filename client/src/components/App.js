import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Movies from "./Movies"
import TVShows from "./TVShows"
import Music from "./Music"

import MusicHome from "./MusicHome/MusicHome";
import MusicSearch from "./MusicSearch";
import Albums from "./Albums/Albums";
import AlbumDetail from "./AlbumDetail/AlbumDetail";
import Artists from "./Artists/Artists";
import Songs from "./Songs/Songs";

import Admin from "./Admin"
import NotFound from "./NotFound"

import PlayerContext from "./Player/context"
import SearchContext from "./Search/context"
import MusicSearchContext from "./MusicSearch/context"
import { useSearch } from "../hooks/useSearch"


const App = () => {

    const searchText = useSearch()
    const [playerItem, setPlayerItem] = useState(null)

    return (
        <React.Fragment>
        <SearchContext.Provider value={searchText}>
        <MusicSearchContext.Provider value={searchText}>
        <PlayerContext.Provider value={{ playerItem, setPlayerItem }}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Routes>
                    <Route path="/movies" element={<Movies/>}/>
                    <Route path="/tv" element={<TVShows/>}/>
                    <Route path="music" element={<Music/>}>
                        <Route index element={<MusicHome/>}/>
                        <Route path="search" element={<MusicSearch />}/>
                        <Route path="albums" element={<Albums/>}/>  
                        <Route path="album/:id" element={<AlbumDetail />}/>
                        <Route path="artists" element={<Artists />}/>
                        <Route path="songs" element={<Songs />}/>
                    </Route>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </PlayerContext.Provider>
        </MusicSearchContext.Provider>
        </SearchContext.Provider>
        </React.Fragment>
    )
}


export default App;