import {
  REQUEST_MUSIC,
  RECEIVE_MUSIC,
  FILTER_MUSIC,
  SORT_MUSIC
} from '../constants/Page'
import * as utils from '../utils/utils.js'

function requestMusic() {
  return {
    type: REQUEST_MUSIC
  }
}

function receiveMusic(json) {
  return {
    type: RECEIVE_MUSIC,
    music: json
  }
}

export function fetchMusic() {
  return dispatch => {
    dispatch(requestMusic())

    utils.callApi('/api/music')
      .then(items => {
        var data = [];
        for (var i = 0; i < items.length; i++) {
          data.push({
            spotify_id: items[i].id,
            album_name: items[i].name, 
            album_art: items[i].images[0].url,
            url_path: items[i].url_path,
            preview_url: items[i].preview_url,
            release_date: items[i].release_date, 
            artist_name: items[i].artists[0].name, 
            label: items[i].label,
            tracks: items[i].tracks,
            external_url: items[i].external_urls.spotify
          });
        }
        dispatch(receiveMusic(data))
      })
      .catch(err => console.log(err));
  }
}

export function filterMusic(searchTerm) {
  return {
    type: FILTER_MUSIC,
    searchTerm
  }
}

export function sortMusic(sortOption) {
  return {
    type: SORT_MUSIC,
    sortOption
  }
}