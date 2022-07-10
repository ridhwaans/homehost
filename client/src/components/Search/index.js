import React, { useContext, useRef, useEffect, useState, useCallback } from "react"
import { searchMoviesBy } from "../../api"
import { useDebounce } from "../../hooks/useDebounce"
import SearchResults from "../SearchResults"
import { useSharedState } from "../../hooks/useSharedState"

const Search = () => {
    const [searchInput, setSearchInput] = useSharedState('searchInput')
    const [movies, setMovies] = useState(null)

    const dInput = useDebounce(searchInput, 1000);

    const fetchData = useCallback(async () => {
        return await searchMoviesBy(dInput, null).then(response => {

            setMovies(response.results)
        })

    }, [dInput]);


    useEffect(() => {

        fetchData()
        return () => setMovies(null)
        
    }, [dInput])

    return (
        <div className="search-background">

            {movies ? (
                <React.Fragment>
                    {movies.length ? (
                        <SearchResults mainTitle={`Results for "${dInput}"`} data={movies} poster={false} />

                    ) : (<div className="not-found">No results :/ </div>)}
                </React.Fragment>
            ) : (
                    <div className="loading-content">
                        <div className="loading-circle"></div>
                        <span className="loading-name">LOADING...</span>
                    </div>

                )}

        </div>
    )
}

export default Search