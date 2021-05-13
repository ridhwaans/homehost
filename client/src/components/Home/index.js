import React, { useEffect, useState, useContext } from 'react';
import { getMoviesBy } from "../../api"
import BigBillboard from "../BigBillboard"
import Slider from "../Slider"
import Search from '../Search';
import SearchContext from "../Search/context"


function Home() {


    const [popularMovies, setPopularMovies] = useState(null)
    const [bestMovies, setBestMovies] = useState(null)
    const [kidsMovies, setKidsMovies] = useState(null)

    const searchContext = useContext(SearchContext)


    const fetchMovies = async () => {
        let popularMovies = await getMoviesBy("populares")
        let kidsMovies = await getMoviesBy("kids")
        let bestMovies = await getMoviesBy("best")

        return { popularMovies, kidsMovies, bestMovies }
    }

    useEffect(() => {

        fetchMovies().then(response => {

            setPopularMovies(response.popularMovies.results)
            setKidsMovies(response.kidsMovies.results)
            setBestMovies(response.bestMovies.results)

        })


        return () => {
            setPopularMovies(null)
            setKidsMovies(null)
            setBestMovies(null)
        }


    }, [])





    return (

        <div>

            {searchContext.searchInput.length > 0 ? (<Search />) : (
                <div>

                    <BigBillboard />

                    {popularMovies && <Slider mainTitle={"Trending now"} data={popularMovies} poster={false} />}

                    {kidsMovies && <Slider mainTitle={"Kids movies"} data={kidsMovies} poster={true} />}

                    {bestMovies && <Slider mainTitle={"Best 2015 movies"} data={bestMovies} poster={false} />}

                </div>
            )}

        </div>


    );
}

export default Home;
