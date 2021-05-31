
const path = require('path');
const express = require('express');
const chokidar = require('chokidar');
const qs = require('qs');
const app = express();
const port = process.env.PORT || 5000;
const log = console.log.bind(console);
require('dotenv').config();

var fs = require('fs');
var bluebird = require('bluebird');
var figlet = require('figlet');

const {Album, Artist, Movie, TVEpisode, TVShow} = require('./models');
var metadataService = require('./services/metadata');
var moviesData = require('./data/movies.json'); // or fs.readFileSync + JSON.parse()
var musicData =  require('./data/music.json'); 
var tvData =  require('./data/tv.json'); 

var watcher = chokidar.watch([process.env.MOVIES_PATH, process.env.TV_PATH, process.env.MUSIC_PATH], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

watcher.on('ready', function() {
  log('Initial scan complete. Ready for changes');
  collection = watcher.getWatched();
})

watcher
.on('add', path => log(`File ${path} has been added`))
.on('change', path => log(`File ${path} has been changed`))
.on('unlink', path => log(`File ${path} has been removed`));

// Serve the static files from the React app
if (process.env.NODE_ENV == 'prod'){
  app.use(express.static(path.join(__dirname, '../client/public')));
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_BASE); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api', (req, res) => {
  if (process.env.NODE_ENV == 'dev' && req.query.generate){
    let filter = req.query.generate.split(',');
    generateMetaData(filter);
    res.json('Generating metadata. Please wait...');
  } else {
    res.json('Dev mode only')
  }
});

app.get('/api/about', (req, res) => {
  let hello = {homehost: 'hello world'};
  res.json(hello);
});

app.get('/api/movies', (req, res) => {
  res.json(moviesData.movies);
});

app.get('/api/tv', (req, res) => {
  res.json(tvData.tv)
});

app.get('/api/music', (req, res) => {
  res.json(musicData.music)
});

app.get('/api/movies/most_popular', function(req, res) {
  // trending now
  const most_popular = moviesData.movies.sort((a,b) => b.popularity - a.popularity).slice(0,25);
  res.json(most_popular);
});

app.get('/api/movies/highest_rated', function(req, res) {
  const highest_rated = moviesData.movies.sort((a,b) => b.vote_average - a.vote_average).slice(0,25);
  res.json(highest_rated);
});

app.get('/api/movies/recently_added', function(req, res) {
  // new
  const recently_added = moviesData.movies.sort((a,b) => b.mtime - a.mtime).slice(0,25);
  res.json(recently_added);
});

// best of year
// by collection/franchise name
// by certification rating

app.get('/api/movies/genres', function(req, res) {
  const genres = [...new Map(moviesData.movies.map(movie => movie.genres).flat(Infinity).map(item => [item.id, item])).values()];

  genres.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })

  res.json(genres);
});

app.get('/api/movies/genres/:name', function(req, res) {
  res.json(moviesData.movies.filter(movie => movie.genres.some( genre => genre.name == req.params.name )));
});

app.get('/api/movies/random', function(req, res) {
  var movie = moviesData.movies[Math.floor(Math.random() * moviesData.movies.length)]
  res.json(movie);
});

app.get('/api/movies/:id', function(req, res) {
  var movie = moviesData.movies.find(movie => movie.id == parseInt(req.params.id));
  res.json(movie);
});

app.get('/api/tv/most_popular', function(req, res) {
  // trending now
  const most_popular = tvData.tv.sort((a,b) => b.popularity - a.popularity).slice(0,25);
  res.json(most_popular);
});
app.get('/api/tv/highest_rated', function(req, res) {
  const highest_rated = tvData.tv.sort((a,b) => b.vote_average - a.vote_average).slice(0,25);
  res.json(highest_rated);
});
app.get('/api/tv/recently_added', function(req, res) {
  // new
  const recently_added = tvData.tv.sort((a,b) => b.mtime - a.mtime).slice(0,25);
  res.json(recently_added);
});
app.get('/api/tv/genres', function(req, res) {
  const genres = [...new Map(tvData.tv.map(tv => tv.genres).flat(Infinity).map(item => [item.id, item])).values()];

  genres.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })

  res.json(genres);
});
app.get('/api/tv/genres/:name', function(req, res) {
  res.json(tvData.tv.filter(tv => tv.genres.some( genre => genre.name == req.params.name )));
});
app.get('/api/tv/random', function(req, res) {
  var tv = tvData.tv[Math.floor(Math.random() * tvData.tv.length)]
  res.json(tv);
});

app.get('/api/tv/:id', function(req, res) {
  var tv = tvData.tv.find(tv => tv.id == parseInt(req.params.id));
  res.json(tv);
});

app.get('/api/music/recently_added', function(req, res) {
  // new
  const recently_added = musicData.music.sort((a,b) => b.mtime - a.mtime).slice(0,25);
  res.json(recently_added);
});

app.get('/api/music/artists', function(req, res) {
  const artists = [...new Map(musicData.music.map(music => music.artists).flat(Infinity).map(item => [item.id, item])).values()];
  console.log(`artist count is ${artists.length}`)
  artists.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })

  res.json(artists);
});

app.get('/api/music/albums/:id', function(req, res) {
  var album = musicData.music.find(album => album.id == req.params.id);
  res.json(album);
});

app.get('/movies/:id', function(req, res) {
  var movie_fs_path = moviesData.movies
    .filter(movie => movie.id == parseInt(req.params.id))
    .map(movie => movie.fs_path).toString();
    
  const path = movie_fs_path
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
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
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/tv/:tv_id/:season_number/:episode_number', function(req, res) {
  var episode_fs_path = tvData.tv
    .find(tv => tv.id == parseInt(req.params.tv_id)) 
    .seasons.find(season => season.season_number == parseInt(req.params.season_number))
    .episodes.find(episode => episode.episode_number == parseInt(req.params.episode_number))
    .fs_path.toString();

  const path = episode_fs_path
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
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
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/music/:album_id/:disc_number/:track_number', function(req, res) {
  var track_fs_path = musicData.music
    .find(album => album.id == req.params.album_id)
    .tracks.items.filter(item => item.disc_number == parseInt(req.params.disc_number) && item.track_number == parseInt(req.params.track_number))
    .map(track => track.fs_path).toString();

    const filePath = track_fs_path
    var stat = fs.statSync(filePath);
    var total = stat.size;
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        var readStream = fs.createReadStream(filePath, {start: start, end: end});
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });
        readStream.pipe(res);
     } else {
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        fs.createReadStream(filePath).pipe(res);
     }

});

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

const multiPropsFilterMusic = (album, keyword) => {
  return (album.name.match(new RegExp(keyword, 'i')) != null
    ) || (
    album.artists.some(x => x.name.match(new RegExp(keyword, 'i')) != null)
    ) || (
    album.tracks.items.some(x => x.name.match(new RegExp(keyword, 'i')) != null))
}

const multiPropsFilterMusicSongs = (keyword) => {
  return musicData.music.map(album => album.tracks.items
    .map(song => {song.album_name = album.name; song.album_images = album.images; song.artists = album.artists; return song}))
    .flat(Infinity)
    .filter(song => song.name.match(new RegExp(keyword, 'i')) != null)
}

const multiPropsFilterMusicArtists = (keyword) => {
  let artists = [...new Map(musicData.music.map(music => music.artists).flat(Infinity).map(item => [item.id, item])).values()];
  return artists.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}

const multiPropsFilterMusicAlbums = (keyword) => {
  return musicData.music.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}

app.get('/api/watch/search', function(req, res) {
  
  let keyword = qs.parse(req.query).q;
  let search_results = {};
  search_results.results = tvData.tv.filter(tv => multiPropsFilterTV(tv, keyword))
  .concat(moviesData.movies.filter(movie => multiPropsFilterMovies(movie, keyword)));

  search_results.count = search_results.results.length
  res.json(search_results);
});

app.get('/api/listen/search', function(req, res) {
  
  let keyword = qs.parse(req.query).q;
  console.log(`keyword is "${keyword}"`)
  let search_results = {results: {songs:[], artists: [], albums: []}, song_count: 0, artist_count: 0, album_count: 0, total_count: 0};
  if (keyword.trim() === "" ) {
    res.json(search_results);
  }
  search_results.results.songs = multiPropsFilterMusicSongs(keyword);
  search_results.results.artists = multiPropsFilterMusicArtists(keyword);
  search_results.results.albums = multiPropsFilterMusicAlbums(keyword);
  search_results.song_count = search_results.results.songs.length
  search_results.artist_count = search_results.results.artists.length
  search_results.album_count = search_results.results.albums.length
  search_results.total_count = Object.values(search_results.results).reduce((acc, group) => acc + group.length, 0)
  res.json(search_results);
});

// Handles any requests that don't match the ones above
if (process.env.NODE_ENV == 'prod'){
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/public/index.html'));
  });
}

var generateMetaData = function(filter = [generateMovieMetaData, generateTVMetaData, generateMusicMetaData]){
  let generators = [];
  filter.map(media => {
    if (media == "movies") generators.push(generateMovieMetaData);
    if (media == "tv") generators.push(generateTVMetaData);
    if (media == "music") generators.push(generateMusicMetaData);
  })
  generators.reduce((p, fn) => p.then(fn), Promise.resolve())
  console.log("Finished async");
};

var generateMovieMetaData = function() {
  return new Promise(function(resolve, reject) {
  
  var re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id
      json = { movies: [] };

  console.log('Generating data for Movies...')
  
  let movies = Object.entries(collection).filter(entry => entry[0].startsWith(process.env.MOVIES_PATH));
  movies = movies.map(folder => folder[1]
    .map(file => `${folder[0]}/${file}`))
    .flat(Infinity)
    .filter(file => !movies.map(folder => folder[0]).includes(file)) // remove paths ending with subdirectories from list

  bluebird.mapSeries(movies, function(file){
  console.log('GET: ' + file);
  // find movie on TMDb 
  return new metadataService().get(new Movie({ id: file.match(re)[1] }))
    .then((movie) => {
    movie.fs_path = file;
    movie.url_path = `http://localhost:${port}/movies/${movie.id}`;
    movie.ctime = fs.statSync(file).ctime;
    movie.mtime = fs.statSync(file).mtime;
    json.movies.push(movie);
    });
  })
  .then(function(movies){
    fs.writeFile('./data/movies.json', JSON.stringify(json, 0, 4), 'utf8', (err)=>{
      if(err) console.log(err)
      else console.log('[MOVIES] File saved');
      resolve(json);
    })
  })
  .catch(function(err){
    console.log('Movie metadata could not be generated due to some error', err);
  });

  });
};

const generateTVMetaData = async () => {
  let re = new RegExp(/(\d+)$/); // tv_id
        re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/); // S(season_number)E(episode_number)
        json = { tv: [] };

  console.log('Generating data for TV...')

  let tv_shows = Object.entries(collection).filter(entry => entry[0].startsWith(process.env.TV_PATH));
  tv_shows.shift(); // remove the TV root directory entry

  await bluebird.mapSeries(tv_shows, async (tv_show) => {
    console.log('GET: ' + tv_show[0]);
    // find tv show on TMDb
    let tv_id = parseInt(tv_show[0].match(re)[1])
    let show = await new metadataService().get(new TVShow({ id: tv_id }))
    show.seasons.map(season => season.episodes = [])

    await bluebird.mapSeries(tv_show[1], async (episode_file) => {
      console.log('GET: ' + episode_file);
      // find tv episode on TMDb
      let season_number = parseInt(episode_file.match(re2)[1])
      let episode_number = parseInt(episode_file.match(re2)[2])
      try {
        let episode = await new metadataService().get(new TVEpisode({ tv_id: tv_id, season_number: season_number, episode_number: episode_number }))
        episode.fs_path = `${tv_show[0]}/${episode_file}`;
        episode.url_path = `http://localhost:${port}/tv/${tv_id}/${episode.season_number}/${episode.episode_number}`;
        episode.ctime = fs.statSync(episode.fs_path).ctime;
        episode.mtime = fs.statSync(episode.fs_path).mtime;

        let seasonIndex = show.seasons.findIndex(season => season.season_number == season_number.toString()); 
        show.seasons[seasonIndex].episodes.push(episode);
      } catch(e) {
        return true; // skip the episode if there is a problem fetching metadata
      }
    });
    // remove season(s) with no episode(s)
    show.seasons = show.seasons.filter(season => season.episodes.length > 0)
    json.tv.push(show);
  });

  fs.writeFile('./data/tv.json', JSON.stringify(json, 0, 4), 'utf8', (err)=>{
    if(err) console.log(err)
    else console.log('[TV] File saved');
  })
};

const findTotalDurationMillis = (items) => {
  const sum = (acc, item) => {
    let add = 0;
    if (item.preview_url != null){
      add = 30;
    }
    if ('url_path' in item){
      add = item.duration_ms;
    }
    return acc + add;
  }
  return items.reduce( (acc, item) => sum(acc,item), 0)
}

const generateMusicMetaData = async () => {

  var re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "Unknown Album";
      json = { music: [] };

  console.log('Generating data for Music...')

  let album_dirs = Object.entries(collection).filter(entry => entry[0].startsWith(process.env.MUSIC_PATH));
    album_dirs.shift(); // remove the Music root directory entry

    await bluebird.mapSeries(album_dirs, async (album_dir) => {
      console.log('GET: ' + album_dir[0]);

      if (album_dir[0].toUpperCase().endsWith(unknown_album.toUpperCase())){
        // build music album not on Spotify
        let album = {
          album_type: 'compilation',
          artists: [{ name: 'Unknown Artist', images: [{url: 'http://i.imgur.com/bVnx0IY.png'}] }],
          images: [{url: 'http://i.imgur.com/bVnx0IY.png'}],
          id: 'unknown',
          name: unknown_album,
          release_date: 'NaN',
          label: 'Unknown Label',
          tracks: {items:[]}
        }

        album_dir[1].forEach( function( track_file, index ) {
          console.log('GET: ' + track_file);

          let item = {}
          item.id = index
          item.name = track_file.replace(/.mp3|.flac/gi,'')
          item.disc_number = 1
          item.track_number = index + 1
          item.duration_ms = 'NaN'
          item.fs_path = `${album_dir[0]}/${track_file}`
          item.url_path = `http://localhost:${port}/music/${album.id}/${item.disc_number}/${item.track_number}`
          item.external_urls = {spotify: null}
          item.ctime = fs.statSync(item.fs_path).ctime
          item.mtime = fs.statSync(item.fs_path).mtime

          album.tracks.items.push(item)
        });

        album.tracks.local_total = album.tracks.items.filter(item => 'url_path' in item).length
        album.tracks.total_duration_ms = 'NaN'
        album.type = Album.name
        json.music.push(album);
        return true; // go next
      } 
      try {
        // find the Spotify music album
        let album = await new metadataService().get(new Album({ id: album_dir[0].match(re)[1] }))
        // remove unnecessary Spotify json
        delete album.available_markets;
        album.tracks.items.map(item => {delete item.artists; delete item.available_markets});

        album_dir[1].forEach( function( track_file, index ) {
          console.log('GET: ' + track_file);
          // for each song in the Spotify music album
          album.tracks.items.forEach(function(item) {
            // if local track found
            if ( (item.disc_number == parseInt(track_file.match(re2)[1] || 1) ) && 
              (item.track_number == parseInt(track_file.match(re2)[3]) ) ) {
              item.fs_path = `${album_dir[0]}/${track_file}` 
              item.url_path = `http://localhost:${port}/music/${album.id}/${item.disc_number}/${item.track_number}`
              item.ctime = fs.statSync(item.fs_path).ctime
              item.mtime = fs.statSync(item.fs_path).mtime
            }
          });
        });

        album.tracks.local_total = album.tracks.items.filter(item => 'url_path' in item).length
        album.tracks.preview_total = album.tracks.items.filter(item => item.preview_url != null).length
        album.tracks.total_duration_ms = findTotalDurationMillis(album.tracks.items)

        // find the artist(s) images for the Spotify music album
        let artist = await new metadataService().get(new Artist({ id: album.artists[0].id }))
        album.artists[0].images = artist.images
        json.music.push(album);

      } catch(e) {
        console.log("There was a problem fetching metadata. Skipping this album")
        return true; // go next
      }
    }) // end of .mapSeries()
    .then(function(music){
      fs.writeFile('./data/music.json', JSON.stringify(json, 0, 4), 'utf8', (err)=>{
        if(err) console.log(err)
        else console.log('[MUSIC] File saved');
      })
    })
    .catch(function(err){
      console.log('Music metadata could not be generated due to some error', err);
    });
};

console.log(figlet.textSync('homehost'));

app.listen(port, () => console.log(`Listening on port ${port}`));
console.log(`Current NODE_ENV is ${process.env.NODE_ENV}`);

console.log(app._router.stack // registered routes
  .filter(r => r.route) // take out all the middleware
  .map(r => `**GET** ${r.route.path}`))  // get all the paths