import {
  REQUEST_TV,
  RECEIVE_TV,
  FILTER_TV,
  SORT_TV
} from '../constants/Page'
import * as utils from '../utils/utils.js'

function requestTV() {
  return {
    type: REQUEST_TV
  }
}

function receiveTV(json) {
  return {
    type: RECEIVE_TV,
    tv: json
  }
}

export function fetchTV() {
  return dispatch => {
    dispatch(requestTV())
    //f (items[i].seasons[j].episodes.length) {
    utils.callApi('/api/tv')
      .then(items => {
        var data = [];
        for (var i = 0; i < items.length; i++) {
          for (var j = 0; j < items[i].seasons.length; j++) {
              data.push({
                tmdb_id: items[i].id,
                overview: items[i].overview,
                name: items[i].name,
                homepage: items[i].homepage,
                poster_path: 'https://image.tmdb.org/t/p/w500' + items[i].seasons[j].poster_path,
                backdrop_path: 'https://image.tmdb.org/t/p/original' + items[i].backdrop_path,
                networks: items[i].networks,
                first_air_date: items[i].first_air_date,
                last_air_date: items[i].last_air_date,
                number_of_seasons: items[i].number_of_seasons,
                number_of_episodes: items[i].number_of_episodes,
                season: items[i].seasons[j]
              });
          }  
        }
        dispatch(receiveTV(data))
      })
      .catch(err => console.log(err));
  }
}

export function filterTV(searchTerm) {
  return {
    type: FILTER_TV,
    searchTerm
  }
}

export function sortTV(sortOption) {
  return {
    type: SORT_TV,
    sortOption
  }
}