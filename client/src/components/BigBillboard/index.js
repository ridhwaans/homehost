import React, { useEffect, useState } from 'react';
import { getMovieInformation, getRandomMovie, IMAGE_BASE } from "../../api"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


function BigBillboard() {

    const [movie, setMovie] = useState(null)

    const fetchMovie = async () => {

        const movie = await getRandomMovie() // getMovieInformation(128)

        return movie
    }

    useEffect(() => {


        fetchMovie().then(movie => {
            setMovie(movie)

        })

        return () => setMovie(null)

    }, [])

    return (

        <div className="billboard-content-limits">
            <div className="billboard-base">
                <div className="billboard-image-wrapper">
                    <img src={movie && `${IMAGE_BASE}original/${movie.backdrop_path}`} alt={"hero"} />

                    <div className="billboard-vignette"></div>
                    <div className="billboard-vignette-bottom"></div>
                    <div className="billboard-maturity-rating"><span>+13</span></div>

                </div>

                <div className="billboard-information">
                    <div className="logo-and-text">

                        <div className="billboard-title">
                            <h3>
                                <div>{movie && movie.title}</div>
                            </h3>
                        </div>    

                        <div className="billboard-description">
                            <div className="episode-title-container"></div>
                            <div className="synopsis">{movie && movie.overview}</div>
                        </div>

                        <div className="billboard-link">
                            <a className="play-link" href={"/"} >
                                <button className="hasLabel">
                                    <span className="play-icon"><FontAwesomeIcon icon={faPlay} /></span>
                                    <span>Play</span>
                                </button>
                            </a>

                            <button className="hasLabel play-link-secondary">
                                <span className="play-icon"><FontAwesomeIcon icon={faQuestionCircle} /></span>
                                <span>Information</span>
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </div>





    );
}

export default BigBillboard;
