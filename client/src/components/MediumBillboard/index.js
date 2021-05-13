import React, { useEffect, useState } from 'react';
import { getMovieInformation, IMAGE_BASE } from "../../api"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

function MediumBillboard() {

    const [poster, setPoster] = useState(null)
    const [background, setBackground] = useState(null)
    const [secondaryBackground, setSecondaryBackground] = useState(null)
    const [synopsis, setSynopsis] = useState(null)
    const [title, setTitle] = useState(null)

    useEffect(async () => {

        let movie = await getMovieInformation("530915").then(response => response.data)

        setPoster(`${IMAGE_BASE}original/${movie.poster_path}`)
        setBackground(`${IMAGE_BASE}original/${movie.backdrop_path}`)
        setSecondaryBackground(`${IMAGE_BASE}original/${movie.backdrop_path}`)
        setSynopsis(movie.overview)
        setTitle(movie.title)

        if (movie.images.backdrops.length > 1) setSecondaryBackground(`${IMAGE_BASE}original/${movie.images.backdrops[1].file_path}`)

    }, [])

    return (
        <div className="medium-billboard">
            <div className="medium-billboard-wrapper">
                <div>
                    <div style={{ "background-image": `url(${background})` }} className="medium-billboard-background-image"></div>

                    <div className="md-billboard-video">

                        <img src={secondaryBackground ? secondaryBackground : background} alt={"background"} />



                        <div className="md-billboard-video-button">
                            <span className="md-billboard-maturity">
                                +13
                            </span>
                        </div>

                    </div>

                    <div className="md-billboard-info">
                        <div className="md-billboard-title">
                            {title}
                        </div>

                        <div className="billboard-link">
                            <a className="play-link" href={"/"} >
                                <button className="hasLabel">
                                    <span className="play-icon"><FontAwesomeIcon icon={faPlay} /></span>
                                    <span>Reproducir</span>
                                </button>
                            </a>

                            <button className="hasLabel play-link-secondary">
                                <span className="play-icon"><FontAwesomeIcon icon={faQuestionCircle} /></span>
                                <span>Más informacion</span>
                            </button>

                        </div>

                        <div className="billboard-additional-information"></div>

                        <div className="billboard-synopsis">{synopsis}</div>

                    </div>


                </div>



            </div>
        </div>
    );
}

export default MediumBillboard;
