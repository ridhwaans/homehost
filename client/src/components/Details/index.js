import React from "react"

const Details = ({ additionalMovieInfo }) => {


    const findOnebyType = (name, type, data) => {

        let first = data.find((item, index) => item.department === type)

        if (first) {
            return (
                <div className="menu-details-item">
                    <span className="details-item-title">{name}</span>
                    <span>{first.name}</span>
                </div>
            )
        }
    }

    return (
        <div className="menu-details">
            <div className="menu-details-content">
                <div className="menu-details-item">
                    <span className="details-item-title">Crew</span>
                    {additionalMovieInfo.credits.cast.map((item, index) => {
                        if (index < 10) {
                            return <span key={index}>{item.name}</span>
                        }
                        return null
                    })}
                </div>

                {findOnebyType("Directing", "Directing", additionalMovieInfo.credits.crew)}

                {findOnebyType("Editing", "Editing", additionalMovieInfo.credits.crew)}

                {findOnebyType("Sound", "Sound", additionalMovieInfo.credits.crew)}

                <div className="menu-details-item">
                    <span className="details-item-title">Genres</span>
                    {additionalMovieInfo.genres.map((item, index) => {
                        return (
                            <span key={index}>{item.name}</span>
                        )

                    })}
                </div>

                {additionalMovieInfo.production_companies[0] && (
                    <div className="menu-details-item">
                        <span className="details-item-title">Production</span>
                        <span>{additionalMovieInfo.production_companies[0].name}</span>

                    </div>
                )}

            </div>
        </div>
    )
}

export default Details