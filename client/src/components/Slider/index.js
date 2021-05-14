import React, { useRef, useEffect } from 'react';
import SelectedItem from "../SelectedItem"
import SliderItem from "../SliderItem"
import SliderContext from "./context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft, faUndo } from '@fortawesome/free-solid-svg-icons'

import useWindowWidth from "../../hooks/useWindowWidth"
import useSlider from "../../hooks/useSlide"


function Slider({ mainTitle, data, poster }) {

    const width = useWindowWidth()
    const ref = useRef(null)

    const {
        moveSection,
        selectSlide,
        closeInformationWindow,
        scaleTiles,
        resetSize,
        sliderPages,
        slideProps,
        hasPrev,
        hasNext,
        content,
        currentSlide,
        additionalMovieInfo,
        paginationIndicator
    } = useSlider(width, ref, 20, data, poster);

    const contextValue = {
        currentSlide
    };

    useEffect(() => { }, [width])

    return (
        <SliderContext.Provider value={contextValue}>
            <div className="sliderBox">
                <h2 className="slider-header">
                    <a href={"/"}>
                        <div>{mainTitle}</div>
                        <div className="see-more">Explore more</div>
                        <div className="see-more-chevron"><FontAwesomeIcon icon={faChevronRight} /></div>
                    </a>
                </h2>

                <div className="slider-container">
                    <div className="slider">

                        <ul className="pagination-indicator">

                            {sliderPages > 0 ? (paginationIndicator(sliderPages)) : ""}

                        </ul>

                        <div className="sliderMask showPeek">

                            <div className={`slider-content ${currentSlide ? "open" : ""}`} ref={ref} {...slideProps} >

                                {content.map(item => {
                                    return <SliderItem
                                        key={item.id}
                                        title={item.id}
                                        data={item}
                                        hover={scaleTiles}
                                        reset={resetSize}
                                        transform={item.transform}
                                        origin={item.origin}
                                        onSelectSlide={selectSlide}
                                        poster={poster}
                                    />
                                })}

                            </div>

                        </div>

                        {hasNext && (<span className="handle handleNext" onClick={() => moveSection("right")}>
                            <strong><FontAwesomeIcon icon={faChevronRight} /></strong>
                        </span>)}

                        {hasPrev && (<span className="handle handlePrev" onClick={() => moveSection("left")}>
                            <strong><FontAwesomeIcon icon={faChevronLeft} /></strong>
                        </span>)}

                        {/* GO BACK TO ZERO */}
                        {hasPrev && hasNext === false ? (<span className="handle handleNext" onClick={() => moveSection("reset")}>
                            <strong><FontAwesomeIcon icon={faUndo} /></strong>
                        </span>) : null}


                    </div>
                </div>

                {currentSlide && <SelectedItem currentSlide={currentSlide} additionalMovieInfo={additionalMovieInfo} closeInformationWindow={closeInformationWindow} />}

            </div>
        </SliderContext.Provider>
    );
}

export default Slider;
