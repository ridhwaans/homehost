import axios from 'axios';

export async function getMovieInformation(id) {

  return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/${id}`)
      .then(function (response) {
          return response.data

      })
}

export async function getTVShowInformation(id) {

  return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/${id}`)
      .then(function (response) {
          return response.data

      })
}

export async function externalSearch(type, text) {
  return await axios
    .get(
      `${process.env.REACT_APP_HOMEHOST_BASE}/api/services/search?type=${type}&q=${text}`
    )
    .then(function (response) {
      return response.data;
    });
}

export async function addMovie(item) {
  return await axios
    .post(`${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/add`, item)
    .then(function (response) {
      return response.data;
    });
}

export async function addEpisode(item) {
  return await axios
    .post(`${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/episodes/add`, item)
    .then(function (response) {
      return response.data;
    });
}

export async function addSong(item) {
  return await axios
    .post(`${process.env.REACT_APP_HOMEHOST_BASE}/api/music/songs/add`, item)
    .then(function (response) {
      return response.data;
    });
}
