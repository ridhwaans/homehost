import React, { useEffect, useState } from 'react';
import { getMovieInformation } from "../../api"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


function BigBillboard() {

    const [movie, setMovie] = useState(null)

    const fetchMovie = async () => {

        const response = await getMovieInformation(128)

        return response
    }

    useEffect(() => {


        fetchMovie().then(response => {
            setMovie(response.data)

        })

        return () => setMovie(null)

    }, [])

    return (

        <div className="billboard-content-limits">
            <div className="billboard-base">
                <div className="billboard-image-wrapper">
                    <img src={"https://occ-0-2692-360.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABfa-QSMvnLx0U1cfYX7Yo9mZrmI2M1VeIcNMthA7AmC-EKG2sOh1fx7tkNOU0Eof6aKRF56p-5WZOd66NtatC4fWkCkN.jpg?r=6da"} alt={"hero"} />

                    <div className="billboard-vignette"></div>
                    <div className="billboard-vignette-bottom"></div>
                    <div className="billboard-maturity-rating"><span>+13</span></div>

                </div>

                <div className="billboard-information">
                    <div className="logo-and-text">

                        <div className="billboard-title">
                            <img src={"https://occ-0-2692-360.1.nflxso.net/dnm/api/v6/TsSRXvDuraoJ7apdkH6tsHhf-ZQ/AAAABe8TY2uebJ4BFANuTXLz5IhBxCLwg8EV7ZOw4K6pCX6KBw0ifxFHAiVVXLqo0p47hX9OOhCDSplQuMfsAUCNEIZ4pDMEcDnpmBpI.png?r=d80"} alt="title" />
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
