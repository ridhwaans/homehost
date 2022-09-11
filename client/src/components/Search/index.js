import React, { useContext, useRef, useEffect, useState, useCallback } from "react"
import { searchMoviesBy } from "../../api"
import useSWR from 'swr'
import { useDebounce } from "../../hooks/useDebounce"
import SearchResults from "../SearchResults"
import { useSharedState } from "../../hooks/useSharedState"
import { useGlobalContext } from '../../contexts/context'

const fetcher = url => fetch(`${process.env.REACT_APP_HOMEHOST_BASE}/api` + url).then(r => r.json())

const Search = () => {

    //const [searchInput, setSearchInput] = useSharedState('searchsearchInput')
    const { moviesAndTVSearchInput, setMoviesAndTVSearchInput } = useGlobalContext();

    const debouncedSearch = useDebounce(moviesAndTVSearchInput, 1000);

    const { data } = useSWR(() => debouncedSearch ? `/watch/search?q=${debouncedSearch}` : null);
    
    //console.log(`Search(), moviesAndTVSearchInput: ${moviesAndTVSearchInput}, debouncedSearch: ${debouncedSearch}, movies.length: ${movies?.length}`)
    //console.log(movies)

    if (data) return (
        <div className="search-background">

            {data.results ? (
                <React.Fragment>
                    {data.results.length ? (
                        <SearchResults mainTitle={`Results for "${debouncedSearch}"`} data={data.results} poster={false} />

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