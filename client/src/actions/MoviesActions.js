import {
  REQUEST_MOVIES,
  RECEIVE_MOVIES,
  FILTER_MOVIES,
  SORT_MOVIES
} from '../constants/Page'
import * as utils from '../utils/utils.js'

function requestMovies() {
  return {
    type: REQUEST_MOVIES
  }
}

function receiveMovies(json) {
  return {
    type: RECEIVE_MOVIES,
    movies: json
  }
}

export function fetchMovies() {

  return dispatch => {
    dispatch(requestMovies())

    utils.callApi('/api/movies')
      .then(items => {
        var data = [];
        for (var i = 0; i < items.length; i++) {
          data.push({
            tmdb_id: items[i].id, 
            imdb_id: items[i].imdb_id, 
            title: items[i].title, 
            poster_path: 'https://image.tmdb.org/t/p/w500' + items[i].poster_path,
            backdrop_path: 'https://image.tmdb.org/t/p/original' + items[i].backdrop_path, 
            url_path: items[i].url_path, 
            release_date: items[i].release_date, 
            runtime: items[i].runtime, 
            revenue: items[i].revenue,
            overview: items[i].overview,
            tagline: items[i].tagline, 
            link: 'http://www.imdb.com/title/' + items[i].imdb_id
          });
        }
        dispatch(receiveMovies(data))
      })
      .catch(err => console.log(err));
  }

}

export function filterMovies(searchTerm) {
  return {
    type: FILTER_MOVIES,
    searchTerm
  }
}

export function sortMovies(sortOption) {
  return {
    type: SORT_MOVIES,
    sortOption
  }
}