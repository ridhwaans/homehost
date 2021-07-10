const { Type, Collection } = require('../constants');

const shuffleArr = (arr) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
}

const formatOne = (result, type) => {
  if (type == Type.Movie){

    result.id = result.tmdb_id
    delete result.tmdb_id
    delete result.fs_path
    formatMany(result.genres, Collection.genres)
    formatMany(result.production_companies, Collection.production_companies)
    formatMany(result.credits, Collection.credits)
    formatMany(result.similar, Collection.similar)

  } else if (result.type == Type.TV.Show){

    result.id = result.tmdb_id
    delete result.tmdb_id
    formatMany(result.genres, Collection.genres)
    formatMany(result.production_companies, Collection.production_companies)
    formatMany(result.seasons, Collection.seasons)
    result.seasons.map(s => {
      formatMany(s.episodes, Collection.episodes)
    })
    formatMany(result.credits, Collection.credits)
    formatMany(result.similar, Collection.similar)

  } else if (result.type == Type.Music.Album){
    
    result.id = result.spotify_id
    delete result.spotify_id
    formatMany(result.artists, Collection.artists)
    formatMany(result.songs, Collection.songs)
  }
  return result
}

const formatMany = (result, collection) => {
  if (collection == Collection.movies){
    result.map(movie => formatOne(movie, Type.Movie))
  } else if (result.type == Collection.tv_shows){
    result.map(tv_show => formatOne(tv_show, Type.TV.Show))
  } else if (result.type == Collection.albums){
    result.map(album => formatOne(album, Type.Music.Album))
  } else if (result.type == Collection.genres){
    result.map(g => {
      g.id = g.tmdb_id;
      delete g.tmdb_id;
    })
  } else if (result.type == Collection.production_companies){
    result.map(p => {
      p.id = p.tmdb_id
      delete p.tmdb_id
    })
  } else if (result.type == Collection.seasons){
    result.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
      delete s.tv_show_tmdb_id
    })
  } else if (result.type == Collection.episodes){
    result.map(e => {
      e.id = e.tmdb_id
      delete e.tmdb_id
      delete e.season_tmdb_id
      delete e.fs_path
    })
  } else if (result.type == Collection.credits){
    result.map(c => {
      c.id = c.tmdb_id
      delete c.tmdb_id
      delete c.movie_tmdb_id
      delete c.tv_show_tmdb_id
    })
    result = result.reduce((acc, credit) => {
      if (credit.character) acc.cast.push(credit);
      if (credit.job) acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
    result.cast.sort((a,b) => a.order - b.order)
  } else if (result.type == Collection.similar){
    result.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
    })
  } else if (result.type == Collection.artists){
    result.map(a => {
      a.id = a.spotify_id
      delete a.spotify_id
    })
  } else if (result.type == Collection.songs){
    result.map(s => {
      s.album_name = s.album.name; 
      s.album_image_url = s.album.image_url; 
      s.artists = s.album.artists; 
      delete s.album;
    })
  }
  return result
}

module.exports = { shuffleArr, formatMany, formatOne }