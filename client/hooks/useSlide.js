import React, { useEffect, useState } from 'react';

const useSlider = (elementWidth, containerRef, countElements, data, poster) => {
  const [viewed, setViewed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [totalInViewport, setTotalInViewport] = useState(0);
  const [slider, setSlider] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [content, setContent] = useState(data);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderPages, setSliderPages] = useState(0);
  const hasPrev = distance < 0;
  const hasNext = viewed + totalInViewport < countElements;

  useEffect(() => {
    if (containerRef.current && data) {
      const containerWidth = containerRef.current.clientWidth;
      const itemWidth = containerRef.current.firstChild.clientWidth;
      const totalInViewport = Math.ceil(containerWidth / itemWidth);

      setSlider(containerRef.current.children);
      setContainerWidth(containerWidth);
      setTotalInViewport(totalInViewport);
      setSliderPages(countElements / totalInViewport);
    }
  }, [containerRef, data, countElements, elementWidth]);

  let slideProps = {
    style: { transform: `translate3d(${distance}px, 0, 0)` },
  };

  let transformProps = {
    edge: {
      left: poster ? '-5%' : '-35%',
      right: poster ? '5%' : '35%',
    },
    normal: {
      left: poster ? '-10%' : '-70%',
      right: poster ? '10%' : '70%',
    },
  };

  const paginationIndicator = (nPages) => {
    let paginationList = [];

    for (let i = 0; i < nPages; i++) {
      if (sliderIndex === i) {
        paginationList.push(<li className="active" key={i}></li>);
      } else {
        paginationList.push(<li key={i}></li>);
      }
    }

    return paginationList;
  };

  const moveSection = (type) => {
    if (type === 'right') {
      setViewed(viewed + totalInViewport);
      setDistance(distance - containerWidth);
      setSliderIndex((prevState) => prevState + 1);
    } else if (type === 'left') {
      setViewed(viewed - totalInViewport);
      setDistance(distance + containerWidth);
      setSliderIndex((prevState) => prevState - 1);
    } else if (type === 'reset') {
      setViewed(0);
      setDistance(0);
      setSliderIndex(0);
    }

    if (currentSlide) {
      let elementsWithClass = Object.entries(slider).filter((item) => {
        if (item[1].className.includes('onScreen')) return true;
        return false;
      });

      let selectedItem = null;
      let selectedItemIndex = null;

      if (type === 'right') {
        elementsWithClass = elementsWithClass.slice(-1)[0];
        elementsWithClass = elementsWithClass[1].dataset.id;

        selectedItem = content.filter((item, index) => {
          if (item.id === parseInt(elementsWithClass)) {
            selectedItemIndex = index;
            return true;
          }
          return false;
        })[0];

        selectedItem = content[selectedItemIndex + 1];
      } else if (type === 'left') {
        elementsWithClass = elementsWithClass[0];
        elementsWithClass = elementsWithClass[1].dataset.id;

        selectedItem = content.filter((item, index) => {
          if (item.id === parseInt(elementsWithClass)) {
            selectedItemIndex = index;
            return true;
          }
          return false;
        })[0];

        selectedItem = content[selectedItemIndex - 1];
      } else if (type === 'reset') {
        selectedItem = content[0];
      }

      setCurrentSlide(selectedItem);
    }
  };

  const selectSlide = async (type, id) => {
    const selected = await content.filter((item) => item.id === id)[0];
    setCurrentSlide(selected);
  };

  const closeInformationWindow = () => {
    setCurrentSlide(null);
  };

  const scaleTiles = (e) => {
    e.preventDefault();

    if (currentSlide) return;

    if (!slider) return;

    const slideItemIndex = Object.entries(slider).findIndex(
      (item) => item[1] === e.currentTarget
    );

    const itemId = slider[slideItemIndex].dataset.id;

    const hoveredSlide = content.filter(
      (item) => item.id === parseInt(itemId)
    )[0];

    let nextItem = isOnScreen(slider[slideItemIndex + 1]);
    let prevItem = isOnScreen(slider[slideItemIndex - 1]);

    //EDGE CASE : CHECK IF FIRST LEFT OR LAST RIGHT ELEMENT

    if (prevItem && nextItem) {
      setContent((prevState) => {
        let newState = prevState.map((item, index) => {
          item.origin = 'center center';

          if (hoveredSlide.id !== item.id && index > slideItemIndex) {
            item.transform = transformProps.edge.right;

            return item;
          } else if (hoveredSlide.id !== item.id && index < slideItemIndex) {
            item.transform = transformProps.edge.left;
            return item;
          } else {
            item.transform = '0px';
            return item;
          }
        });

        return newState;
      });
    } else if (!prevItem) {
      setContent((prevState) => {
        let newState = prevState.map((item, index) => {
          if (hoveredSlide.id !== item.id && index > slideItemIndex) {
            item.transform = transformProps.normal.right;
            item.origin = 'center center';
            return item;
          } else {
            item.transform = '0px';
            item.origin = 'left center';

            return item;
          }
        });

        return newState;
      });
    } else if (!nextItem) {
      setContent((prevState) => {
        let newState = prevState.map((item, index) => {
          if (hoveredSlide.id !== item.id && index < slideItemIndex) {
            item.transform = transformProps.normal.left;
            item.origin = 'center center';
            return item;
          } else {
            item.transform = '0px';
            item.origin = 'center right ';
            return item;
          }
        });

        return newState;
      });
    }
  };

  const isOnScreen = (slide) => {
    if (slide && slide.className.split(' ').includes('onScreen')) {
      return true;
    }

    return false;
  };

  const resetSize = () => {
    setContent((prevState) => {
      let newState = prevState.map((item) => {
        item.transform = '0px';
        return item;
      });

      return newState;
    });
  };

  return {
    moveSection,
    selectSlide,
    closeInformationWindow,
    hasPrev,
    hasNext,
    scaleTiles,
    resetSize,
    sliderIndex,
    sliderPages,
    slideProps,
    content,
    currentSlide,
    paginationIndicator,
  };
};

export default useSlider;
