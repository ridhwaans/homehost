import React, { useEffect, useState, useContext } from 'react';
import { getMoviesBy, getMoviesByGenre } from "../../api"
import useSWR from 'swr'
import Player from "../Player"
import Header from "../Header"
import BigBillboard from "../BigBillboard"
import MediumBillboard from "../MediumBillboard"
import Slider from "../Slider"
import Search from '../Search';
import { useSharedState } from "../../hooks/useSharedState"
import { useGlobalContext } from '../../contexts/context'

import '../../assets/Movies.css';

function Movies() {
    
    useEffect(() => {
        document.documentElement.className = "movies-html-and-body"; //<html>
        document.body.className = "movies-html-and-body"; //<body>
    }, [])


    const {data : recentlyAddedMovies } = useSWR('/movies/recently_added');
    const {data : popularMovies } = useSWR('/movies/most_popular');
    const {data : highestRatedMovies } = useSWR('/movies/highest_rated');
    const {data : animationMovies } = useSWR('/movies/genre/Animation');
    const {data : warMovies } = useSWR('/movies/genre/War');

    //const [searchInput, setSearchInput] = useSharedState('moviessearchInput')
    const { moviesAndTVSearchInput, setMoviesAndTVSearchInput } = useGlobalContext();

    //console.log(`Movies() searchInput is ${searchInput}`)
 
    return (
        <div className="movies">
        <div className="background-app">
        <Player />
        <Header />
        {moviesAndTVSearchInput?.length > 0 ? (<Search />) : (
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
