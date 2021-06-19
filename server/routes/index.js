const fs = require('fs');
const qs = require('qs');
const path = require('path');
const express = require('express');
const { getAbout,
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
  getRandomMovieOrTVShow } = require('../data')
const { generateMetaData } = require('../jobs')
const router = express.Router();

const readStreamMp4 = (req, res, file_path) => {
  const stat = fs.statSync(file_path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(file_path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(file_path).pipe(res)
  }
}

const readStreamMpeg = (req, res, file_path) => {
  var stat = fs.statSync(file_path);
  var total = stat.size;
  if (req.headers.range) {
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];

    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total-1;
    var chunksize = (end-start)+1;
    var readStream = fs.createReadStream(file_path, {start: start, end: end});
    res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
    });
    readStream.pipe(res);
  } else {
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
    fs.createReadStream(file_path).pipe(res);
  }
}

router.get('/api', (req, res) => {
  if (process.env.NODE_ENV == 'dev' && req.query.generate){
    const filter = req.query.generate.split(',');
    generateMetaData(filter);
    res.json('Generating metadata. Please wait...');
  } else {
    res.json('Dev mode only')
  }
});
  
router.get('/api/about', (req, res) => {
  res.json(getAbout());
});

router.get('/api/movies', (req, res) => {
  res.json(getAllMovies());
});

router.get('/api/movies/most_popular', (req, res) => {
  res.json(getMostPopularMovies());
});

router.get('/api/movies/highest_rated', (req, res) => {
  res.json(getHighestRatedMovies());
});

router.get('/api/movies/recently_added', (req, res) => {
  res.json(getRecentlyAddedMovies());
});

router.get('/api/movies/genres', (req, res) => {  
  res.json(getMovieGenres());
});

router.get('/api/movies/genres/:name', (req, res) => {
  res.json(getMoviesByGenre(req.params.name));
});

router.get('/api/movies/random', (req, res) => {
  res.json(getRandomMovie());
});

router.get('/api/movies/:id', (req, res) => {
  res.json(getMovie(req.params.id));
});

router.get('/api/tv', (req, res) => {
  res.json(getAllTVShows())
});

router.get('/api/tv/most_popular', (req, res) => {
  res.json(getMostPopularTVShows());
});

router.get('/api/tv/highest_rated', (req, res) => {
  res.json(getHighestRatedTVShows());
});

router.get('/api/tv/recently_added', (req, res) => {
  res.json(getRecentlyAddedTVShows());
});

router.get('/api/tv/genres', (req, res) => {
  res.json(getTVShowGenres());
});

router.get('/api/tv/genres/:name', (req, res) => {
  res.json(getTVShowsByGenre(req.params.name));
});

router.get('/api/tv/random', (req, res) => {
  res.json(getRandomTVShow());
});

router.get('/api/tv/:id', (req, res) => {
  res.json(getTVShow(req.params.id));
});

router.get('/api/music/recently_added', (req, res) => {
  res.json(getRecentlyAddedMusic());
});

router.get('/api/music/artists', (req, res) => {
  res.json(getAllArtists());
});

router.get('/api/music/albums', (req, res) => {
  res.json(getAllAlbums())
});

router.get('/api/music/albums/:id', (req, res) => {
  res.json(getMusicAlbum(req.params.id));
});

router.get('/api/music/songs', (req, res) => {
  res.json(getAllSongs())
});

router.get('/movies/:id', (req, res) => {
  readStreamMp4(req, res, getMovieFilePath(req.params.id))
});

router.get('/tv/:tv_id/:season_number/:episode_number', (req, res) => {
  readStreamMp4(req, res, getEpisodeFilePath(req.params.tv_id,req.params.season_number,req.params.episode_number))
});

router.get('/music/:album_id/:disc_number/:track_number', (req, res) => {
  readStreamMpeg(req, res, getSongFilePath(req.params.album_id, req.params.disc_number, req.params.track_number))
});

router.get('/api/watch/search', (req, res) => {
  const keyword = qs.parse(req.query).q;
  res.json(searchMoviesAndTV(keyword));
});

router.get('/api/listen/search', (req, res) => {
  const keyword = qs.parse(req.query).q;
  console.log(`keyword is "${keyword}"`)
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
  res.json(searchMusic(keyword));
});

router.get('/api/watch/billboard', (req, res) => {
  const billboardItem = getRandomMovieOrTVShow()
  // get by id: getMovie(), getTVShow()
  res.json(billboardItem);
});

// Handles any requests that don't match the routes above
if (process.env.NODE_ENV == 'prod'){
  router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  });
}

module.exports = router;