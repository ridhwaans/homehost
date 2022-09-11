import React, { useEffect } from 'react';
import useSWR from 'swr';
import Player from '../Player';
import Header from '../Header';
import BigBillboard from '../BigBillboard';
import Slider from '../Slider';
import Search from '../Search';
import { useGlobalContext } from '../../contexts/context';

import '../../assets/Movies.css';

function TVShows() {
  const { data: recentlyAddedTVShows } = useSWR(`/tv/recently_added`);
  const { data: popularTVShows } = useSWR(`/tv/most_popular`);
  const { data: highestRatedTVShows } = useSWR(`/tv/highest_rated`);
  const { data: animationTVShows } = useSWR(`/tv/genre/Animation`);

  const { moviesAndTVSearchInput, setMoviesAndTVSearchInput } =
    useGlobalContext();

  useEffect(() => {
    document.documentElement.className = 'movies-html-and-body'; //<html>
    document.body.className = 'movies-html-and-body'; //<body>
  }, []);

  return (
    <div className="movies">
      <div className="background-app">
        <Player />
        <Header />
        {moviesAndTVSearchInput?.length > 0 ? (
          <Search />
        ) : (
          <React.Fragment>
            <BigBillboard />

            {recentlyAddedTVShows && (
              <Slider
                mainTitle={'Recently Added'}
                data={recentlyAddedTVShows}
                poster={false}
              />
            )}

            {popularTVShows && (
              <Slider
                mainTitle={'Most Popular'}
                data={popularTVShows}
                poster={true}
              />
            )}

            {animationTVShows && (
              <Slider
                mainTitle={'Animation'}
                data={animationTVShows}
                poster={false}
              />
            )}

            {highestRatedTVShows && (
              <Slider
                mainTitle={'Highest Rated'}
                data={highestRatedTVShows}
                poster={true}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default TVShows;
