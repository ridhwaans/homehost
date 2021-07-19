import React, { useState } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Movies from "./Movies"
import TVShows from "./TVShows"
import Music from "./Music"
import Admin from "./Admin"
import NotFound from "./NotFound"

import PlayerContext from "./Player/context"
import SearchContext from "./Search/context"
import MusicSearchContext from "./MusicSearch/context"
import { useSearch } from "../hooks/useSearch"


const Routes = () => {

    const searchText = useSearch()
    const [playerItem, setPlayerItem] = useState(null)

    return (
        <React.Fragment>
        <SearchContext.Provider value={searchText}>
        <MusicSearchContext.Provider value={searchText}>
        <PlayerContext.Provider value={{ playerItem, setPlayerItem }}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route component={Movies} exact path="/movies" />
                    <Route component={TVShows} exact path="/tv" />
                    <Route component={Music} path="/music" />
                    <Route component={Admin} path="/admin" />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </PlayerContext.Provider>
        </MusicSearchContext.Provider>
        </SearchContext.Provider>
        </React.Fragment>
    )
}


export default Routes;