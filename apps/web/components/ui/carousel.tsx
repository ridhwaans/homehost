//@ts-nocheck

'use client'
import React from 'react';
import { Box } from '@modulz/design-system';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { composeEventHandlers } from '@radix-ui/primitive';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

const [CarouselProvider, useCarouselContext] = createContext<{
  _: any;
  slideListRef: React.RefObject<HTMLElement>;
  onNextClick(): void;
  onPrevClick(): void;
  nextDisabled: boolean;
  prevDisabled: boolean;
}>('Carousel');

export const Carousel = (props) => {
  const ref = useRef<React.ElementRef<typeof Box>>(null);
  const { children, ...carouselProps } = props;
  const slideListRef = useRef<HTMLElement>(null);
  const [_, force] = useState({});
  const [nextDisabled, setNextDisabled] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const navigationUpdateDelay = useRef(100);
  useEffect(() => smoothscroll.polyfill(), []);

  const getSlideInDirection = useCallbackRef((direction: 1 | -1) => {
    const slides = ref.current?.querySelectorAll<HTMLElement>('[data-slide-intersection-ratio]');
    if (slides) {
      const slidesArray = Array.from(slides.values());

      if (direction === 1) {
        slidesArray.reverse();
      }

      return slidesArray.find((slide) => slide.dataset.slideIntersectionRatio !== '0');
    }
  });

  const handleNextClick = useCallback(() => {
    const nextSlide = getSlideInDirection(1);

    if (nextSlide) {
      const { scrollLeft, scrollWidth, clientWidth } = slideListRef.current;
      const itemWidth = nextSlide.clientWidth;
      const itemsToScroll = itemWidth * 2.5 < document.documentElement.offsetWidth ? 2 : 1;
      const nextPos = Math.floor(scrollLeft / itemWidth) * itemWidth + itemWidth * itemsToScroll;
      slideListRef.current.scrollTo({ left: nextPos, behavior: 'smooth' });

      // Disable previous & next buttons immediately
      setPrevDisabled(nextPos <= 0);
      setNextDisabled(scrollWidth - nextPos - clientWidth <= 0);
      // Wait for scroll animation to finish before the buttons *might* show up again
      navigationUpdateDelay.current = 500;
    }
  }, [getSlideInDirection, setPrevDisabled]);

  const handlePrevClick = useCallback(() => {
    const prevSlide = getSlideInDirection(-1);
    if (prevSlide) {
      const { scrollLeft, scrollWidth, clientWidth } = slideListRef.current;
      const itemWidth = prevSlide.clientWidth;
      const itemsToScroll = itemWidth * 2.5 < document.documentElement.offsetWidth ? 2 : 1;
      const nextPos = Math.ceil(scrollLeft / itemWidth) * itemWidth - itemWidth * itemsToScroll;
      slideListRef.current.scrollTo({ left: nextPos, behavior: 'smooth' });

      // Disable previous & next buttons immediately
      setPrevDisabled(nextPos <= 0);
      setNextDisabled(scrollWidth - nextPos - clientWidth <= 0);
      // Wait for scroll animation to finish before the buttons *might* show up again
      navigationUpdateDelay.current = 500;
    }
  }, [getSlideInDirection, setPrevDisabled]);

  useEffect(() => {
    // Keep checking for whether we need to disable the navigation buttons, debounced
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        if (slideListRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = slideListRef.current;
          setPrevDisabled(scrollLeft <= 0);
          setNextDisabled(scrollWidth - scrollLeft - clientWidth <= 0);
          navigationUpdateDelay.current = 100;
        }
      });
    }, navigationUpdateDelay.current);
  });

  useEffect(() => {
    const slidesList = slideListRef.current;
    if (slidesList) {
      const handleScrollStartAndEnd = debounce(() => force({}), 100, {
        leading: true,
        trailing: true,
      });
      slidesList.addEventListener('scroll', handleScrollStartAndEnd);
      window.addEventListener('resize', handleScrollStartAndEnd);
      force({});
      return () => {
        slidesList.removeEventListener('scroll', handleScrollStartAndEnd);
        window.removeEventListener('resize', handleScrollStartAndEnd);
      };
    }
  }, [slideListRef]);

  return (
    <CarouselProvider
      _={_}
      nextDisabled={nextDisabled}
      prevDisabled={prevDisabled}
      slideListRef={slideListRef}
      onNextClick={handleNextClick}
      onPrevClick={handlePrevClick}
    >
      <Box {...carouselProps} ref={ref}>
        {children}
      </Box>
    </CarouselProvider>
  );
};

export const CarouselSlideList = (props) => {
  const context = useCarouselContext('CarouselSlideList');
  const ref = React.useRef<React.ElementRef<typeof Box>>(null);
  const composedRefs = useComposedRefs(ref, context.slideListRef);
  const [dragStart, setDragStart] = React.useState(null);

  const handleMouseMove = useCallbackRef((event) => {
    if (ref.current) {
      const distanceX = event.clientX - dragStart.pointerX;
      ref.current.scrollLeft = dragStart.scrollX - distanceX;
    }
  });

  const handleMouseUp = useCallbackRef(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setDragStart(null);
  });

  return (
    <Box
      {...props}
      ref={composedRefs}
      data-state={dragStart ? 'dragging' : undefined}
      onMouseDownCapture={composeEventHandlers(props.onMouseDownCapture, (event: MouseEvent) => {
        // Drag only if main mouse button was clicked
        if (event.button === 0) {
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
          setDragStart({
            scrollX: (event.currentTarget as HTMLElement).scrollLeft,
            pointerX: event.clientX,
          });
        }
      })}
      onPointerDown={composeEventHandlers(props.onPointerDown, (event: PointerEvent) => {
        const element = event.target as HTMLElement;
        element.style.userSelect = 'none';
        element.setPointerCapture(event.pointerId);
      })}
      onPointerUp={composeEventHandlers(props.onPointerUp, (event: PointerEvent) => {
        const element = event.target as HTMLElement;
        element.style.userSelect = '';
        element.releasePointerCapture(event.pointerId);
      })}
    />
  );
};

export const CarouselSlide = (props) => {
  const { as: Comp = Box, ...slideProps } = props;
  const context = useCarouselContext('CarouselSlide');
  const ref = useRef<React.ElementRef<typeof Box>>(null);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersectionRatio(entry.intersectionRatio),
      { root: context.slideListRef.current, threshold: [0, 0.5, 1] }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [context.slideListRef]);

  return (
    <Comp
      {...slideProps}
      ref={ref}
      data-slide-intersection-ratio={intersectionRatio}
      onDragStart={(event) => {
        event.preventDefault();
        isDraggingRef.current = true;
      }}
      onClick={(event) => {
        if (isDraggingRef.current) {
          event.preventDefault();
        }
      }}
    />
  );
};

export const CarouselNext = (props) => {
  const { as: Comp = 'button', ...nextProps } = props;
  const context = useCarouselContext('CarouselNext');
  return (
    <Comp {...nextProps} onClick={() => context.onNextClick()} disabled={context.nextDisabled} />
  );
};

export const CarouselPrevious = (props) => {
  const { as: Comp = 'button', ...prevProps } = props;
  const context = useCarouselContext('CarouselPrevious');
  return (
    <Comp {...prevProps} onClick={() => context.onPrevClick()} disabled={context.prevDisabled} />
  );
};
