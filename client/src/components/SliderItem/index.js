import React, { useRef, useState, useEffect, useContext } from 'react';
import { IMAGE_BASE } from "../../api"
import genresList from "../../genres"
import SliderContext from "../Slider/context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faPlayCircle, faThumbsUp, faPlus } from '@fortawesome/free-solid-svg-icons'

import useVisibility from "../../hooks/useVisibility"


function SliderItem(props) {


    const ref = useRef(null)
    const [inViewport, setInViewport] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false)

    const sliderWrapper = useContext(SliderContext);

    const itemVisible = () => {
        setInViewport(true)
    }

    const itemNotVisible = () => {
        setInViewport(false)
    }

    const onHover = (e) => {

        if (!sliderWrapper.currentSlide) {
            props.hover(e)
            setShowOverlay(true)
        }

    }

    const onHoverLeave = (e) => {
        props.reset(e)
        setShowOverlay(false)
    }

    const isActive = sliderWrapper.currentSlide && sliderWrapper.currentSlide.id === props.title;

    useVisibility(ref, itemVisible, itemNotVisible);

    useEffect(() => {

    }, [inViewport, setInViewport])

    const translate = `translateX(${props.transform})`

    const styled = { transform: translate, "transformOrigin": props.origin, transition: "all 0.3s ease-in-out" }

    return (
        <div
            style={styled}
            data-id={props.title}
            className={`slider-item ${inViewport ? "onScreen" : ""} ${props.poster === true ? "poster" : "card"}`}
            ref={ref}
            onMouseLeave={(e) => onHoverLeave(e)}
            onMouseEnter={(e) => onHover(e)}
        >
            <div className="boxart-container">
                <div className="boxart">
                    {props.poster === true ? (
                        <React.Fragment>
                            {props.data.backdrop_path ? <img src={`${IMAGE_BASE}w500/${props.data.poster_path}`} alt="boxart" /> : <img style={{ "background": "black" }} alt="boxart" />}
                        </React.Fragment>
                    ) : (
                            <React.Fragment>
                                {props.data.backdrop_path ? <img src={`${IMAGE_BASE}w500/${props.data.backdrop_path}`} alt="boxart" /> : <img style={{ "background": "black" }} alt="boxart" />}
                            </React.Fragment>
                        )}

                </div>
            </div>

            <button onClick={() => props.onSelectSlide(props.title)} className="show-details">
                <span><FontAwesomeIcon icon={faAngleDown} /></span>
            </button>

            {props.poster === false && (
                <div className={`item-overlay ${showOverlay ? "open" : ""}`}>
                    <div className="item-wrapper">
                        <div className="item-overview">
                            <div className="item-overview-play">
                                <span><FontAwesomeIcon icon={faPlayCircle} /></span>
                            </div>
                            <div className="item-overview-title">{props.data.title}</div>
                            <div className="item-overview-metadata">
                                <span className="metadata-rating">New</span>
                                <span className="metadata-maturity">{props.data.adult === true ? "+18" : "+13"}</span>
                                <span>{props.data.vote_average}</span>
                            </div>
                            <div className="item-overview-synopsis">
                                {props.data.genre_ids.map((item, index) => {
                                    if (index < 3) {
                                        let genreName = genresList.find(genre => genre.id === item)

                                        if (index > 0) {
                                            return (<React.Fragment key={index}><span className="separator"></span><span>{genreName.name}</span></React.Fragment>)
                                        } else {
                                            return <span key={index}>{genreName.name}</span>
                                        }
                                    }

                                    return null
                                })}
                            </div>
                        </div>
                        <div className="item-actions">
                            <div className="item-action-buttons">
                                <div><span><FontAwesomeIcon icon={faThumbsUp} /></span></div>
                                <div><span><FontAwesomeIcon icon={faPlus} /></span></div>
                            </div>
                        </div>
                        <div className="item-chevron"></div>
                    </div>

                </div>
            )}


            {isActive && (<div className="mark" />)}

        </div>
    );
}

export default SliderItem;
