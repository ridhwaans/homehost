import React from "react";
import { Route, Switch, BrowserRouter, useLocation } from "react-router-dom";
import Movies from "./Movies"
import TVShows from "./TVShows"
import Header from "./Header"
import Footer from "./Footer"

import SearchContext from "./Search/context"
import { useSearch } from "../hooks/useSearch"


const Routes = () => {

    const searchText = useSearch()
    const location = useLocation()

    console.log(location.pathname);
    return (
        <div className="background-app">
            <SearchContext.Provider value={searchText}>
                <Header />
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Switch>
                        <Route component={Movies} exact path="/movies" />
                        <Route component={TVShows} exact path="/tv" />
                    </Switch>
                </BrowserRouter>
            </SearchContext.Provider>
            <Footer />
        </div>
    )
}


export default Routes;