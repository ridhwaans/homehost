import React from "react"

import { IMAGE_BASE } from "../../api"

const Similar = ({ additionalMovieInfo }) => {
    return (
        <div className="menu-similar">
            <div className="menu-similar-content">


                {additionalMovieInfo.similar.results.map((similarMovie, index) => {

                    if (index < 4) {
                        return (
                            <div className="similar-item" key={index}>
                                <div className="similar-item-image"><img src={`${IMAGE_BASE}original/${similarMovie.backdrop_path}`} alt={"item"} /></div>
                                <div className="similar-item-metada">
                                    <span className="similar-item-title">{similarMovie.title}</span><br />
                                    <span className="release-date">{similarMovie.release_date}</span>
                                </div>
                                <div className="similar-item-synopsis">{similarMovie.overview}</div>
                            </div>
                        )
                    }

                    return null

                })}
            </div>
        </div>
    )
}


export default Similar