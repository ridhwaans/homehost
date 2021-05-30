import React, { useEffect, useState } from 'react';
import { getRandomMovie, getMovieInformation } from "../../api"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faFilm } from '@fortawesome/free-solid-svg-icons'

import '../../assets/Movies.css';

function NotFound() {

    const [movie, setMovie] = useState(null)

    const fetchMovie = async () => {

        const movie = await getMovieInformation("10681")

        return movie
    }

    useEffect(() => {
        document.documentElement.className = "movies-html-and-body"; //<html>
        document.body.className = "movies-html-and-body"; //<body>

        fetchMovie().then(movie => {
            setMovie(movie)

        })

        return () => setMovie(null)
    }, [])


    return (
        <div className="movies">
        <div className="background-app bg" style={movie && { backgroundImage: `url(${process.env.REACT_APP_IMAGE_BASE}original/${movie.backdrop_path})` }}>
        <div className="not-found-content">
                <h1>Not found</h1>
            <div className="not-found-content-body">
                    <p>Sorry, we can't find that page</p>
                <div className="not-found-content-buttons">
                    <a className="play-link" href={"/movies"}>
                        <button className="hasLabel">
                            <span className="play-icon"><FontAwesomeIcon icon={faFilm} /></span>
                            <span>Movies Home</span>
                        </button>
                    </a>
                    <a className="play-link" href={"/music"}>
                        <button className="hasLabel">
                            <span className="play-icon"><FontAwesomeIcon icon={faMusic} /></span>
                            <span>Music Home</span>
                        </button>
                    </a>
                </div>
            </div>
        </div>

        <span id="" class="imageSource" data-uia="">FROM <strong>{movie && movie.title.toUpperCase()}</strong></span>


        </div>
        </div>
    )
}

export default NotFound;
