'use client'

import React from "react"
import {
  Box,
  Text,
  styled,
  darkTheme,
  Container,
  Flex,
  Paragraph,
  Section,
  Link,
} from '@modulz/design-system';

import {
  Carousel,
  CarouselSlideList,
  CarouselSlide,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { Movie } from '@/lib/types'

const DemoContainer = styled('div', {
  display: 'flex',
  position: 'relative',
  ai: 'center',
  jc: 'center',
  width: 300,
  height: 400,
  borderRadius: '$3',
  mb: '$2',

  // Content slightly above vertical center feels perfectly centred
  pb: '$3',

  // Can't select text because the carousel is draggable
  userSelect: 'none',
  cursor: 'default',

  '@bp1': {
    width: 400,
  },
});

const StyledFocusArea = styled('div', {
  outline: 0,
  borderRadius: '$3',
  '&:focus': {
    boxShadow: '0 0 0 2px $colors$blue8',
  },
  '&:focus:not(:focus-visible)': {
    boxShadow: 'none',
  },
});

const FocusArea = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof StyledFocusArea>>(
  ({ children, onKeyDown, ...props }, forwardedRef) => {
    const ownRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(ownRef, forwardedRef);


    return (
      <StyledFocusArea
        {...props}
        data-focus-area
        ref={composedRef}
        tabIndex={0}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          // Move focus inside the FocusArea when Enter or Spacebar is pressed
          if (
            event.target === event.currentTarget &&
            (event.key === 'Enter' || event.key === ' ')
          ) {
            // We are looking for something obviously focusable
            const tier1 =
              '[role="menu"], [role="dialog"] input, [role="dialog"] button, [tabindex="0"]';
            const tier2 = 'a, button, input, select, textarea';

            // Search for tier 1 and tier 2 elements, prioritising
            const elementToFocus = [
              event.currentTarget.querySelector<HTMLElement>(tier1),
              event.currentTarget.querySelector<HTMLElement>(tier2),
            ].filter((el) => Boolean(el))[0];

            if (elementToFocus) {
              event.preventDefault();
              elementToFocus.focus();
            }
          }

          // Move focus onto the FocusArea when Escape is pressed, unless the focus is currently inside a modal
          if (
            event.key === 'Escape' &&
            event.target instanceof HTMLElement &&
            event.target !== event.currentTarget &&
            event.target.closest('[role="dialog"], [role="menu"]') === null
          ) {
            event.currentTarget.focus();
          }
        }}
      >
        <div data-focus-area-entry />
        {children}
        <div data-focus-area-exit />
      </StyledFocusArea>
    );
  }
);

interface Props {
  data?: Movie[]
}

FocusArea.displayName = "FocusArea"
export function CarouselHorizontal({ data }: Props) {

  const lastUsedFocusArea = React.useRef<HTMLElement | null>(null);
  const isRoving = React.useRef(false);

  React.useEffect(() => {
    lastUsedFocusArea.current = document.querySelector('[data-focus-area]');
  }, []);

  const onFocusAreaFocus = React.useCallback((event: React.FocusEvent<HTMLElement>) => {
    lastUsedFocusArea.current = event.currentTarget;
  }, []);

  // We are implementing a simple roving tab index with some tweaks
  const onFocusAreaKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const allAreas = Array.from(document.querySelectorAll<HTMLElement>('[data-focus-area]'));
        const thisIndex = allAreas.findIndex((el) => el === event.currentTarget);
        const nextIndex = Math.min(thisIndex + 1, allAreas.length - 1);
        const nextDemo = allAreas[nextIndex];
        isRoving.current = true;
        nextDemo.focus();
        (nextDemo as any).scrollIntoViewIfNeeded?.(true);
        lastUsedFocusArea.current = nextDemo;
        isRoving.current = false;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const allAreas = Array.from(document.querySelectorAll<HTMLElement>('[data-focus-area]'));
        const thisIndex = allAreas.findIndex((el) => el === event.currentTarget);
        const prevIndex = Math.max(thisIndex - 1, 0); // thisIndex - 1 >= 0 ? thisIndex - 1 : allAreas.length - 1;
        const prevDemo = allAreas[prevIndex];
        isRoving.current = true;
        prevDemo.focus();
        (prevDemo as any).scrollIntoViewIfNeeded?.(true);
        lastUsedFocusArea.current = prevDemo;
        isRoving.current = false;
      }

      // Tab key press moves focus to the next element after the carousel
      if (event.key === 'Tab' && event.shiftKey === false) {
        const selector = 'a, button, input, select, textarea, [data-focus-area-exit]';
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
          (element) => element.tabIndex !== -1 || element.hasAttribute('data-focus-area-exit')
        );

        // Find last exit guard
        elements.reverse();
        const lastExit = elements.find((el) => el.matches('[data-focus-area-exit]')) as HTMLElement;
        elements.reverse();
        const lastExitIndex = elements.indexOf(lastExit);
        const nextElement = elements[lastExitIndex + 1];

        if (nextElement) {
          event.preventDefault();
          nextElement.focus();
        }
      }

      // Shift + Tab key press moves focus to the previous element before the carousel
      if (event.key === 'Tab' && event.shiftKey) {
        const selector = 'a, button, input, select, textarea, [data-focus-area-entry]';
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
          (element) => element.tabIndex !== -1 || element.hasAttribute('data-focus-area-entry')
        );

        // Find first entry guard
        const firstEntry = elements.find((el) => el.matches('[data-focus-area-entry]')) as HTMLElement;
        const firstEntryIndex = elements.indexOf(firstEntry);
        const prevElement = elements[firstEntryIndex - 1];

        if (prevElement) {
          event.preventDefault();
          prevElement.focus();
        }
      }
    }
  }, []);

  return (
    <Section>
        <Box css={{ position: 'relative' }}>
          <Carousel>
            <CarouselSlideList
              css={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'min-content',
                ox: 'auto',
                oy: 'hidden',
                py: '$1',
                WebkitOverflowScrolling: 'touch',

                // Gap between slides
                $$gap: '$space$5',

                // calculate the left padding to apply to the scrolling list
                // so that the carousel starts aligned with the container component
                // the "1145" and "$5" values comes from the <Container /> component
                '$$scroll-padding': 'max($$gap, calc((100% - 1145px) / 2 + $$gap))',
                pl: '$$scroll-padding',

                // hide scrollbar
                MsOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },

                // Can't have nice grid gap because Safari butchers scroll padding with it
                '& > *': {
                  pr: '$$gap',
                },
              }}
            >
              {Array.isArray(data) ? ((data).map(item => {
                return <CarouselSlide>
                <FocusArea
                  aria-label="Dialog component demo"
                  onKeyDown={onFocusAreaKeyDown}
                  onFocus={onFocusAreaFocus}
                >
                  <DemoContainer
                    aria-hidden
                    css={{
                      background: 'linear-gradient(120deg, $indigo6, $crimson5)',
                      [`.${darkTheme} &`]: {
                        background: 'linear-gradient(120deg, $indigo4, $plum3)',
                      },
                    }}
                  >
                  </DemoContainer>
                </FocusArea>
                <GrabBox>
                  <Text as="h3" size="3" css={{ fontWeight: 500, lineHeight: '25px' }}>
                    {item.title}
                  </Text>
                  <Text as="p" size="3" variant="gray" css={{ lineHeight: '23px' }}>
                    {item.tagline}
                  </Text>
                </GrabBox>
              </CarouselSlide>
              })) : <></>}

              <CarouselSlide>
                <FocusArea onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
                  <DemoContainer
                    css={{
                      backgroundColor: '$whiteA6',
                      boxShadow: '0 0 0 1px $colors$slateA5',
                      [`.${darkTheme} &`]: {
                        backgroundColor: '$blackA4',
                      },
                    }}
                  >
                    <Flex align="center" direction="column" gap="2">
                      <Text size="2" variant="gray">
                        See more components in the docs
                      </Text>
                      <Text size="3">
                        <Link href="/docs/primitives/overview/getting-started"
                          style={{ display: 'inline-flex', alignItems: 'center' }}
                        >
                            View docs
                            <ArrowRightIcon />
                        </Link>
                      </Text>
                    </Flex>
                  </DemoContainer>
                </FocusArea>
              </CarouselSlide>
            </CarouselSlideList>
            <Box
              css={{
                position: 'absolute',
                top: 'calc(50% - $7)',
                left: '15px',
              }}
            >
              <CarouselPrevious
                aria-label="Show previous demo"
                tabIndex={-1}
                as={CarouselArrowButton}
              >
                <ArrowLeftIcon />
              </CarouselPrevious>
            </Box>
            <Box
              css={{
                position: 'absolute',
                top: 'calc(50% - $7)',
                right: '15px',
              }}
            >
              <CarouselNext aria-label="Show next demo" tabIndex={-1} as={CarouselArrowButton}>
                <ArrowRightIcon />
              </CarouselNext>
            </Box>
          </Carousel>
        </Box>
    </Section>
  )
}

const CarouselArrowButton = styled('button', {
  unset: 'all',
  outline: 0,
  margin: 0,
  border: 0,
  padding: 0,

  display: 'flex',
  position: 'relative',
  zIndex: 1,
  ai: 'center',
  jc: 'center',
  bc: '$panel',
  br: '$round',
  width: '$7',
  height: '$7',
  color: '$hiContrast',

  boxShadow: '$colors$blackA11 0px 2px 12px -5px, $colors$blackA5 0px 1px 3px',
  willChange: 'transform, box-shadow, opacity',
  transition: 'all 100ms',

  '@hover': {
    '&:hover': {
      boxShadow: '$colors$blackA10 0px 3px 16px -5px, $colors$blackA5 0px 1px 3px',
      transform: 'translateY(-1px)',

      // Fix a bug when hovering at button edges would cause the button to jitter because of transform
      '&::before': {
        content: '',
        inset: -2,
        br: '$round',
        position: 'absolute',
      },
    },
  },
  '&:focus': {
    boxShadow: `
      $colors$blackA10 0px 3px 16px -5px,
      $colors$blackA5 0px 1px 3px,
      $colors$blue8 0 0 0 2px
    `,
    transform: 'translateY(-1px)',
  },
  '&:focus:not(:focus-visible)': {
    boxShadow: '$colors$blackA11 0px 2px 12px -5px, $colors$blackA5 0px 1px 3px',
  },
  '&:active:not(:focus)': {
    boxShadow: '$colors$blackA11 0px 2px 12px -5px, $colors$blackA5 0px 1px 3px',
  },
  '&:active': {
    transform: 'none',
    transition: 'opacity 100ms',
  },
  '&:disabled': {
    opacity: 0,
  },
  '@media (hover: none) and (pointer: coarse)': {
    display: 'none',
  },
});

const GrabBox = styled('div', {
  cursor: 'grab',
  '&:active': { cursor: 'grabbing' },

  // Fill in spaces between slides
  mr: '-$$gap',
  pr: '$$gap',
});
