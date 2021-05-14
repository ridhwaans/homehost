import React, { useEffect, useState, useContext } from 'react';
import { getMoviesBy, getMoviesByGenre } from "../../api"
import BigBillboard from "../BigBillboard"
import MediumBillboard from "../MediumBillboard"
import Slider from "../Slider"
import Search from '../Search';
import SearchContext from "../Search/context"


function Movies() {

    const [recentlyAddedMovies, setRecentlyAddedMovies] = useState(null)
    const [popularMovies, setPopularMovies] = useState(null)
    const [animationMovies, setAnimationMovies] = useState(null)
    const [highestRatedMovies, setHighestRatedMovies] = useState(null)

    const searchContext = useContext(SearchContext)


    const fetchMovies = async () => {
        let recentlyAddedMovies = await getMoviesBy("recently_added")
        let popularMovies = await getMoviesBy("most_popular")
        let animationMovies = await getMoviesByGenre("Animation")
        let highestRatedMovies = await getMoviesBy("highest_rated")

        return { recentlyAddedMovies, popularMovies, animationMovies, highestRatedMovies }
    }

    useEffect(() => {

        fetchMovies().then(response => {

            setRecentlyAddedMovies(response.recentlyAddedMovies)
            setPopularMovies(response.popularMovies)
            setAnimationMovies(response.animationMovies)
            setHighestRatedMovies(response.highestRatedMovies)

        })


        return () => {
            setRecentlyAddedMovies(null)
            setPopularMovies(null)
            setAnimationMovies(null)
            setHighestRatedMovies(null)
        }


    }, [])





    return (

        <div>

            {searchContext.searchInput.length > 0 ? (<Search />) : (
                <div>

                    <BigBillboard />

                    {recentlyAddedMovies && <Slider mainTitle={"Recently Added"} data={recentlyAddedMovies} poster={false} />}

                    {popularMovies && <Slider mainTitle={"Most Popular"} data={popularMovies} poster={true} />}

                    {animationMovies && <Slider mainTitle={"Animation"} data={animationMovies} poster={false} />}

                    {highestRatedMovies && <Slider mainTitle={"Highest Rated"} data={highestRatedMovies} poster={true} />}

                </div>
            )}

        </div>


    );
}

export default Movies;
