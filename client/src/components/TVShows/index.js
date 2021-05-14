import React, { useEffect, useState, useContext } from 'react';
import { getTVShowsBy, getTVShowsByGenre } from "../../api"
import BigBillboard from "../BigBillboard"
import MediumBillboard from "../MediumBillboard"
import Slider from "../Slider"
import Search from '../Search';
import SearchContext from "../Search/context"


function TVShows() {

    const [recentlyAddedTVShows, setRecentlyAddedTVShows] = useState(null)
    const [popularTVShows, setPopularTVShows] = useState(null)
    const [animationTVShows, setAnimationTVShows] = useState(null)
    const [highestRatedTVShows, setHighestRatedTVShows] = useState(null)

    const searchContext = useContext(SearchContext)


    const fetchTVShows = async () => {
        let recentlyAddedTVShows = await getTVShowsBy("recently_added")
        let popularTVShows = await getTVShowsBy("most_popular")
        let animationTVShows = await getTVShowsByGenre("Animation")
        let highestRatedTVShows = await getTVShowsBy("highest_rated")

        return { recentlyAddedTVShows, popularTVShows, animationTVShows, highestRatedTVShows }
    }

    useEffect(() => {

        fetchTVShows().then(response => {

            setRecentlyAddedTVShows(response.recentlyAddedTVShows)
            setPopularTVShows(response.popularTVShows)
            setAnimationTVShows(response.animationTVShows)
            setHighestRatedTVShows(response.highestRatedTVShows)

        })


        return () => {
            setRecentlyAddedTVShows(null)
            setPopularTVShows(null)
            setAnimationTVShows(null)
            setHighestRatedTVShows(null)
        }


    }, [])





    return (

        <div>

            {searchContext.searchInput.length > 0 ? (<Search />) : (
                <div>

                    <BigBillboard />

                    {recentlyAddedTVShows && <Slider mainTitle={"Recently Added"} data={recentlyAddedTVShows} poster={false} />}

                    {popularTVShows && <Slider mainTitle={"Most Popular"} data={popularTVShows} poster={true} />}

                    {animationTVShows && <Slider mainTitle={"Animation"} data={animationTVShows} poster={false} />}

                    {highestRatedTVShows && <Slider mainTitle={"Highest Rated"} data={highestRatedTVShows} poster={true} />}

                </div>
            )}

        </div>


    );
}

export default TVShows;
