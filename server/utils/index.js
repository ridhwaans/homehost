const shuffleArr = (arr) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
}

const formatKeys = () => {
  movies.map(movie => {
    movie.id = movie.tmdb_id
    delete movie.tmdb_id
    delete movie.fs_path

    movie.genres.map(g => {
      g.id = g.tmdb_id;
      delete g.tmdb_id;
    })

    movie.production_companies.map(p => {
      p.id = p.tmdb_id
      delete p.tmdb_id
    })

    movie.credits.map(c => {
      c.id = c.tmdb_id
      delete c.tmdb_id
      delete c.movie_tmdb_id
      delete c.tv_show_tmdb_id
    })

    movie.credits = movie.credits.reduce((acc, credit) => {
      if (credit.character) acc.cast.push(credit);
      if (credit.job) acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
    movie.credits.cast.sort((a,b) => a.order - b.order)

    movie.similar.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
    })
  })

  tv_shows.map(tv_show => {
    tv_show.id = tv_show.tmdb_id
    delete tv_show.tmdb_id

    tv_show.genres.map(g => {
      g.id = g.tmdb_id
      delete g.tmdb_id
    })

    tv_show.production_companies.map(p => {
      p.id = p.tmdb_id
      delete p.tmdb_id
    })

    tv_show.seasons.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
      delete s.tv_show_tmdb_id
      s.episodes.map(e => {
        e.id = e.tmdb_id
        delete e.tmdb_id
        delete e.season_tmdb_id
        delete e.fs_path
      })
    })

    tv_show.credits.map(c => {
      c.id = c.tmdb_id
      delete c.tmdb_id
      delete c.movie_tmdb_id
      delete c.tv_show_tmdb_id
    })

    tv_show.credits = tv_show.credits.reduce((acc, credit) => {
      if (credit.character) acc.cast.push(credit);
      if (credit.job) acc.crew.push(credit);
      return acc;
    }, { cast: [], crew: [] })
    tv_show.credits.cast.sort((a,b) => a.order - b.order)

    tv_show.similar.map(s => {
      s.id = s.tmdb_id
      delete s.tmdb_id
    })
  })

  albums.map(album => {
    album.id = album.spotify_id
    delete album.spotify_id

    album.artists.map(a => {
      a.id = a.spotify_id
      delete a.spotify_id
    })

    album.songs.map(s => {
      s.id = s.spotify_id
      delete s.spotify_id
      delete s.album_spotify_id
      delete s.fs_path
    })
  })

}

module.exports = { shuffleArr, formatKeys }