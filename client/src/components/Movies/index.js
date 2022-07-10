import React, { useEffect, useState, useContext } from 'react';
import { getMoviesBy, getMoviesByGenre } from "../../api"
import Player from "../Player"
import Header from "../Header"
import BigBillboard from "../BigBillboard"
import MediumBillboard from "../MediumBillboard"
import Slider from "../Slider"
import Search from '../Search';
import { useSharedState } from "../../hooks/useSharedState"

import '../../assets/Movies.css';

function Movies() {

    const [recentlyAddedMovies, setRecentlyAddedMovies] = useState(null)
    const [popularMovies, setPopularMovies] = useState(null)
    const [animationMovies, setAnimationMovies] = useState(null)
    const [highestRatedMovies, setHighestRatedMovies] = useState(null)
    const [warMovies, setWarMovies] = useState(null)

    const [searchInput, setSearchInput] = useSharedState('searchInput')

    const fetchMovies = async () => {
        let recentlyAddedMovies = await getMoviesBy("recently_added")
        let popularMovies = await getMoviesBy("most_popular")
        let animationMovies = await getMoviesByGenre("Animation")
        let highestRatedMovies = await getMoviesBy("highest_rated")
        let warMovies = await getMoviesByGenre("War")

        return { recentlyAddedMovies, popularMovies, animationMovies, highestRatedMovies, warMovies }
    }

    useEffect(() => {
        document.documentElement.className = "movies-html-and-body"; //<html>
        document.body.className = "movies-html-and-body"; //<body>

        fetchMovies().then(response => {

            setRecentlyAddedMovies(response.recentlyAddedMovies)
            setPopularMovies(response.popularMovies)
            setAnimationMovies(response.animationMovies)
            setHighestRatedMovies(response.highestRatedMovies)
            setWarMovies(response.warMovies)

        })


        return () => {
            setRecentlyAddedMovies(null)
            setPopularMovies(null)
            setAnimationMovies(null)
            setHighestRatedMovies(null)
            setWarMovies(null)
        }


    }, [])


    console.log(`searchInput is ${searchInput}`)
    return (
        <div className="movies">
        <div className="background-app">
        <Player />
        <Header />
        {searchInput?.length > 0 ? (<Search />) : (
            <React.Fragment>
                <BigBillboard />

                {recentlyAddedMovies && <Slider mainTitle={"Recently Added"} data={recentlyAddedMovies} poster={false} />}

                {popularMovies && <Slider mainTitle={"Most Popular"} data={popularMovies} poster={true} />}

                {animationMovies && <Slider mainTitle={"Animation"} data={animationMovies} poster={false} />}

                {highestRatedMovies && <Slider mainTitle={"Highest Rated"} data={highestRatedMovies} poster={true} />}

                {warMovies && <Slider mainTitle={"War"} data={warMovies} poster={false} />}

            </React.Fragment>
        )}
        </div>
        </div>
    );
}

export default Movies;
