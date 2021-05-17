import React, { useEffect, useRef, useState, useContext } from "react"
import PlayerContext from "../Player/context"
import { IMAGE_BASE } from "../../api"

const Episodes = ({ additionalMovieInfo }) => {
    const { playerItem, setPlayerItem } = useContext(PlayerContext)
    const [seasonNumber, setSeasonNumber] = useState(1)

    const changeSeason = e => {
        setSeasonNumber(e.target.selectedIndex + 1)
    }

    useEffect(() => {
    
    }, [])

    return (
        <div className="menu-similar">
            <select id="seasons" onChange={changeSeason}>
            {additionalMovieInfo && additionalMovieInfo.seasons.map((season, index) => {
                //console.log(`default season is ${seasonNumber}`)
                return (
                    <option value={index}>{season.name}</option>
                )
            })}
            </select>

            <div className="menu-similar-content">

                {additionalMovieInfo && additionalMovieInfo.seasons && additionalMovieInfo.seasons
                .find(season => season.season_number == seasonNumber).episodes.map((episode, index) => {

                    if (index < 4) {
                        return (
                            <div className="similar-item" key={index}>
                                <div className="similar-item-image"><img onClick={() => setPlayerItem({data: additionalMovieInfo, season_number: seasonNumber, episode_number: index+1})} src={`${IMAGE_BASE}original/${episode.still_path}`} alt={"item"} /></div>
                                <div className="similar-item-metada">
                                    <span className="similar-item-title">{episode.name}</span><br />
                                    <span className="release-date">{episode.air_date}</span>
                                </div>
                                <div className="similar-item-synopsis">{episode.overview}</div>
                            </div>
                        )
                    }

                    return null

                })}
            </div>
        </div>
    )
}


export default Episodes