import React, { useEffect, useRef, useState, useContext } from 'react';
import { getTVShowInformation, getRandomTVShow, getMovieInformation, getRandomMovie } from "../../api"
import PlayerContext from "../Player/context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


function BigBillboard() {

    const [movie, setMovie] = useState(null)
    const { playerItem, setPlayerItem } = useContext(PlayerContext)

    const fetchMovie = async () => {

        const movie = await getRandomMovie() // getMovieInformation()

        return movie
    }

    const fetchTVShow = async () => {

        const tv = await getRandomTVShow() // getTVShowInformation()

        return tv
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
                    <img src={movie && `${process.env.REACT_APP_IMAGE_BASE}original/${movie.backdrop_path}`} alt={"hero"} />

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
                            <a className="play-link">
                                <button className="hasLabel" onClick={() => setPlayerItem(movie)}>
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
