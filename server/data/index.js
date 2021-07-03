const { shuffleArr } = require('../utils');
const { getAll } = require('../jobs');

var database;

const multiPropsFilterMovies = (movie, keyword) => {
  return (movie.title.match(new RegExp(keyword, 'i')) != null ||
    movie.tagline.match(new RegExp(keyword, 'i')) != null ||
    movie.overview.match(new RegExp(keyword, 'i')) != null
    ) || (
    movie.credits.cast.some(x => x.name.match(new RegExp(keyword, 'i')) != null)
    ) || (
    movie.credits.crew.find(x => x.job === "Director").name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterTV = (tv, keyword) => {
  return (tv.name.match(new RegExp(keyword, 'i')) != null ||
    tv.tagline.match(new RegExp(keyword, 'i')) != null ||
    tv.overview.match(new RegExp(keyword, 'i')) != null
    ) || (
    tv.seasons.some(x => x.name.match(new RegExp(keyword, 'i')) || x.overview.match(new RegExp(keyword, 'i')) != null)
    ) || (
    tv.seasons.some(x => x.episodes.some(ep => ep.name.match(new RegExp(keyword, 'i')) || ep.overview.match(new RegExp(keyword, 'i')) != null))
    ) || (
    tv.credits.cast.some(x => x.name.match(new RegExp(keyword, 'i')) != null))
}
  
const multiPropsFilterMusicSongs = async (keyword) => {
  database = database || await getAll()
  return database.music.map(album => album.songs
    .map(song => {song.album_name = album.name; song.album_images = album.images; song.artists = album.artists; return song}))
    .flat(Infinity)
    .filter(song => song.url_path != null)
    .filter(song => song.name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterMusicArtists = async (keyword) => {
  database = database || await getAll()
  let artists = [...new Map(database.music.map(music => music.artists).flat(Infinity).map(item => [item.id, item])).values()];
  return artists.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterMusicAlbums = async (keyword) => {
  database = database || await getAll()
  return database.music.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}
  
const getAbout = () => {
  const hello = {homehost: 'hello world', environment: process.env.NODE_ENV};
  return hello
}

const getAllMovies = async () => {
  database = database || await getAll()
  return database.movies
}

const getMostPopularMovies = async () => {
  database = database || await getAll()
  return database.movies.sort((a,b) => b.popularity - a.popularity).slice(0,25);
}

const getHighestRatedMovies = async () => {
  database = database || await getAll()
  return database.movies.sort((a,b) => b.vote_average - a.vote_average).slice(0,25);
}

const getRecentlyAddedMovies = async () => {
  database = database || await getAll()
  return database.movies.sort((a,b) => new Date(b.mtime) - new Date(a.mtime)).slice(0,25);
}

const getMovieGenres = async () => {
  database = database || await getAll()
  const genres = [...new Map(database.movies.map(movie => movie.genres).flat(Infinity).map(item => [item.id, item])).values()];
  genres.sort((a, b) => {
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })
  return genres;
}

const getMoviesByGenre = async (name) => {
  database = database || await getAll()
  return shuffleArr(database.movies.filter(movie => movie.genres.some( genre => genre.name == name )))
}

const getRandomMovie = async () => {
  database = database || await getAll()
  return database.movies[Math.floor(Math.random() * database.movies.length)]
}

const getMovie = async (id) => {
  database = database || await getAll()
  return database.movies.find(movie => movie.id == parseInt(id))
}

const getAllTVShows = async () => {
  database = database || await getAll()
  return database.tv
}

const getMostPopularTVShows = async () => {
  database = database || await getAll()
  return database.tv.sort((a,b) => b.popularity - a.popularity).slice(0,25)
}

const getHighestRatedTVShows = async () => {
  database = database || await getAll()
  return database.tv.sort((a,b) => b.vote_average - a.vote_average).slice(0,25)
}

const getRecentlyAddedTVShows = async () => {
  database = database || await getAll()
  return database.tv.sort((a,b) => b.mtime - a.mtime).slice(0,25)
}

const getTVShowGenres = async () => {
  database = database || await getAll()
  const genres = [...new Map(database.tv.map(tv => tv.genres).flat(Infinity).map(item => [item.id, item])).values()];
  genres.sort((a, b) => {
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })
  return genres;
}

const getTVShowsByGenre = async (name) => {
  database = database || await getAll()
  return shuffleArr(database.tv.filter(tv => tv.genres.some( genre => genre.name == name )))
}

const getRandomTVShow = async () => {
  database = database || await getAll()
  return database.tv[Math.floor(Math.random() * database.tv.length)]
}

const getTVShow = async (id) => {
  database = database || await getAll()
  return database.tv.find(tv => tv.id == parseInt(id))
}

const getRecentlyAddedMusic = async () => {
  database = database || await getAll()
  return database.music.sort((a,b) => b.mtime - a.mtime).slice(0,25)
}

const getAllArtists = async () => {
  database = database || await getAll()
  return [...new Map(database.music.map(music => music.artists).flat(Infinity).map(item => [item.id, item])).values()]
}

const getAllAlbums = async () => {
  database = database || await getAll()
  return database.music
}

const getMusicAlbum = async (id) => {
  database = database || await getAll()
  return database.music.find(album => album.id == id)
}

const getAllSongs = async () => {
  database = database || await getAll()
  const songs = database.music.map(album => album.songs
    .map(song => {song.album_name = album.name; song.album_images = album.images; song.artists = album.artists; return song}))
    .flat(Infinity)
    .filter(song => song.url_path != null)
  return songs
}

const getMovieFilePath = async (id) => {
  database = database || await getAll()
  const file_path = database.movies
    .filter(movie => movie.id == parseInt(id))
    .map(movie => movie.fs_path).toString();
  return file_path
}

const getSongFilePath = async (album_id, disc_number, track_number) => {
  database = database || await getAll()
  const file_path = database.music
    .find(album => album.id == album_id)
    .songs.filter(item => item.disc_number == parseInt(disc_number) && item.track_number == parseInt(track_number))
    .map(track => track.fs_path).toString();
  return file_path
  }

const getEpisodeFilePath = async (tv_id, season_number, episode_number) => {
  database = database || await getAll()
  const file_path = database.tv
    .find(tv => tv.id == parseInt(tv_id)) 
    .seasons.find(season => season.season_number == parseInt(season_number))
    .episodes.find(episode => episode.episode_number == parseInt(episode_number))
    .fs_path.toString();
  return file_path
  }

const searchMoviesAndTV = async (keyword) => {
  database = database || await getAll()
  let search_results = {};
  search_results.results = database.tv.filter(tv => multiPropsFilterTV(tv, keyword))
    .concat(database.movies.filter(movie => multiPropsFilterMovies(movie, keyword)));
    search_results.count = search_results.results.length

  return search_results
}

const searchMusic = async (keyword) => {
  database = database || await getAll()
  let search_results = {results: {songs:[], artists: [], albums: []}, song_count: 0, artist_count: 0, album_count: 0, total_count: 0};
  if (keyword.trim() === "") {
    return search_results;
  }
  search_results.results.songs = await multiPropsFilterMusicSongs(keyword);
  search_results.results.artists = await multiPropsFilterMusicArtists(keyword);
  search_results.results.albums = await multiPropsFilterMusicAlbums(keyword);
  search_results.song_count = search_results.results.songs.length
  search_results.artist_count = search_results.results.artists.length
  search_results.album_count = search_results.results.albums.length
  search_results.total_count = Object.values(search_results.results).reduce((acc, group) => acc + group.length, 0)

  return search_results
}

const getRandomMovieOrTVShow = async () => {
  database = database || await getAll()
  const item = Math.random() < (database.tv.length / database.movies.length).toFixed(2) ? 
    await getRandomTVShow() : await getRandomMovie()
  return item
}

module.exports = { getAbout,
  getAllMovies,
  getMostPopularMovies,
  getHighestRatedMovies,
  getRecentlyAddedMovies,
  getMovieGenres,
  getMoviesByGenre,
  getRandomMovie,
  getMovie,
  getAllTVShows,
  getMostPopularTVShows,
  getHighestRatedTVShows,
  getRecentlyAddedTVShows,
  getTVShowGenres,
  getTVShowsByGenre,
  getRandomTVShow,
  getTVShow,
  getRecentlyAddedMusic,
  getAllArtists,
  getAllAlbums,
  getMusicAlbum,
  getAllSongs,
  getMovieFilePath,
  getSongFilePath,
  getEpisodeFilePath,
  searchMoviesAndTV,
  searchMusic,
  getRandomMovieOrTVShow }