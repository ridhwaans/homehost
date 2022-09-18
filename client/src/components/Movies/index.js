import React, { useEffect } from 'react';
import useSWR from 'swr';

import '../../assets/Movies.css';
import { useGlobalContext } from '../../contexts/context';
import BigBillboard from '../BigBillboard';
import Header from '../Header';
import Player from '../Player';
import Search from '../Search';
import Slider from '../Slider';

function Movies() {
  useEffect(() => {
    document.documentElement.className = 'movies-html-and-body'; //<html>
    document.body.className = 'movies-html-and-body'; //<body>
  }, []);

  const { data: recentlyAddedMovies } = useSWR('/movies/recently_added');
  const { data: popularMovies } = useSWR('/movies/most_popular');
  const { data: highestRatedMovies } = useSWR('/movies/highest_rated');
  const { data: animationMovies } = useSWR('/movies/genre/Animation');
  const { data: warMovies } = useSWR('/movies/genre/War');

  const { moviesAndTVSearchInput } = useGlobalContext();

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

            {recentlyAddedMovies && (
              <Slider
                mainTitle={'Recently Added'}
                data={recentlyAddedMovies}
                poster={false}
              />
            )}

            {popularMovies && (
              <Slider
                mainTitle={'Most Popular'}
                data={popularMovies}
                poster={true}
              />
            )}

            {animationMovies && (
              <Slider
                mainTitle={'Animation'}
                data={animationMovies}
                poster={false}
              />
            )}

            {highestRatedMovies && (
              <Slider
                mainTitle={'Highest Rated'}
                data={highestRatedMovies}
                poster={true}
              />
            )}

            {warMovies && (
              <Slider mainTitle={'War'} data={warMovies} poster={false} />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default Movies;
