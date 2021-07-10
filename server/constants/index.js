const Type = Object.freeze({
    Movie: 'Movie',
    TV: {
      Show: 'Show',
      Season: 'Season',
      Episode: 'Episode'
    },
    Music: {
      Album: 'Album',
      Artist: 'Artist',
      Song: 'Song'
    }
  })

const Collection = Object.freeze({
  movies: 'movies',
  tv_shows: 'tv_shows',
  genres: 'genres',
  production_companies: 'production_companies',
  seasons: 'seasons',
  episodes: 'episodes',
  credits: 'credits',
  similar: 'similar',
  albums: 'albums',
  artists: 'artists',
  songs: 'songs'
})

module.exports = { Type, Collection }