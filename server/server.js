
const path = require('path');
const express = require('express');
const chokidar = require('chokidar');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

var fs = require('fs');
var bluebird = require('bluebird');
var figlet = require('figlet');

const {Album, Movie, TVEpisode, TVShow} = require('./models');
var metadataService = require('./services/metadata');
var moviesData = require('./data/movies.json'); // or fs.readFileSync + JSON.parse()
var musicData =  require('./data/music.json'); 
var tvData =  require('./data/tv.json'); 

var files = [];
var watcher = chokidar.watch([process.env.MOVIES_PATH, process.env.TV_PATH, process.env.MUSIC_PATH], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});
const log = console.log.bind(console);

watcher.on('ready', function() {
  log('Initial scan complete. Ready for changes');
  collection = watcher.getWatched();
  files = Object.entries(collection)
      .map(groups => groups
      .filter(group => typeof group == "object")
      .map(files => files
      .map(file => `${groups[0]}/${file}`))) // first entry will be the folder name to concatenate
      .flat(Infinity)
      .filter(x => !Object.keys(collection).includes(x));
  //console.table(files);
})

watcher
//.on('add', path => log(`File ${path} has been added`))
.on('change', path => log(`File ${path} has been changed`))
.on('unlink', path => log(`File ${path} has been removed`));

// Serve the static files from the React app
if (process.env.NODE_ENV == 'prod'){
  app.use(express.static(path.join(__dirname, 'client/public'))); //fix this
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
  let hello = {homehost: 'Hello, put env vars here'};
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
  
  bluebird.mapSeries(files.filter(x => x.startsWith(process.env.MOVIES_PATH)), function(file){
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

  let tv_shows = Object.keys(collection)
    .filter(group => typeof group == "string")
    .filter(group => group.startsWith(process.env.TV_PATH) && group != process.env.TV_PATH);

  await bluebird.mapSeries(tv_shows, async (tv_show) => {
    console.log('GET: ' + tv_show);
    // find tv show on TMDb
    let tv_id = parseInt(tv_show.match(re)[1])
    let show = await new metadataService().get(new TVShow({ id: tv_id }))

    show.seasons.forEach(function(season, i) {
      show.seasons[i].episodes = []
    });

    let episode_files = files.filter(x => x.startsWith(process.env.TV_PATH) && x.includes(tv_id))
    await bluebird.mapSeries(episode_files, async (episode_file) => {
      console.log('GET: ' + episode_file);
      // find tv episode on TMDb
      let season_number = parseInt(episode_file.match(re2)[1])
      let episode_number = parseInt(episode_file.match(re2)[2])
      try {
        let episode = await new metadataService().get(new TVEpisode({ tv_id: tv_id, season_number: season_number, episode_number: episode_number }))
        episode.fs_path = episode_file;
        episode.url_path = `http://localhost:${port}/tv/${tv_id}/${episode.season_number}/${episode.episode_number}`;
        episode.ctime = fs.statSync(episode_file).ctime;
        episode.mtime = fs.statSync(episode_file).mtime;

        let seasonIndex = show.seasons.findIndex(season => season.season_number == season_number.toString()); 
        show.seasons[seasonIndex].episodes.push(episode);
      } catch(e) {
        return true; // skip the episode if there is a problem fetching metadata
      }
    });
    // remove seasons with no episodes
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
    if ('preview_url' in item){
      add = 30;
    }
    if ('url_path' in item){
      add = item.duration_ms;
    }
    return acc + add;
  }
  return items.reduce( (acc, item) => sum(acc,item), 0)
}

var generateMusicMetaData = function() {
  return new Promise(function(resolve, reject) {

  var re = new RegExp(/(\w+)$/); // album_id
      re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
      unknown_album = "UNKNOWN ALBUM";
      json = { music: [] };

  console.log('Generating data for Music...')

  let album_dirs = Object.keys(collection)
    .filter(group => typeof group == "string")
    .filter(group => group.startsWith(process.env.MUSIC_PATH) && group != process.env.MUSIC_PATH);
        
    bluebird.mapSeries(album_dirs, function(album_dir){
      console.log('GET: ' + album_dir);
      let track_files = [];

      if (album_dir.toUpperCase().endsWith(unknown_album)){
        // build music album not on Spotify
        let album = {
          id: 'unknown',
          name: 'Unknown Album',
          artists: [{name: 'Various Artists'}],
          images: [{url: 'http://i.imgur.com/bVnx0IY.png'}],
          release_date: 'NaN',
          label: 'Various Labels',
          tracks: {items:[]}
        }
        track_files = files.filter(x => x.toUpperCase().includes(unknown_album))

        track_files.forEach( function( track_file, index ) {
          track = track_file.replace(/^.*[\\\/]/, ''); // get filename from full filepath
          console.log('GET: ' + track);

          let item = {}
          item.id = index
          item.name = track.replace(/.mp3|.flac/gi,'')
          item.disc_number = 1
          item.track_number = index + 1
          item.duration_ms = 'NaN'
          item.fs_path = track_file
          item.url_path = `http://localhost:${port}/music/${album.id}/${item.disc_number}/${item.track_number}`
          item.external_urls = {spotify: null}
          item.ctime = fs.statSync(track_file).ctime
          item.mtime = fs.statSync(track_file).mtime

          album.tracks.items.push(item)
        });

        album.tracks.local_total = album.tracks.items.filter(item => 'url_path' in item).length
        album.tracks.total_duration_ms = findTotalDurationMillis(album.tracks.items)
        json.music.push(album);
        return true; // go next
      } 
      try {
        // find the Spotify music album
        return new metadataService().get(new Album({ id: album_dir.match(re)[1] }))
        .then((album) => {
          // remove unnecessary Spotify json
          delete album.available_markets;
          for(var i=0;i<album.tracks.items.length;i++){
            delete album.tracks.items[i].artists;
            delete album.tracks.items[i].available_markets;
          }
          album.tracks.items.map(item => {delete item.artists; delete item.available_markets});

          track_files = files.filter(x => x.includes(album_dir.match(re)[1]))
          track_files.forEach( function( track_file, index ) {
            track = track_file.replace(/^.*[\\\/]/, ''); // get filename from full filepath
            console.log('GET: ' + track);
            // for each track in the Spotify music album
            album.tracks.items.forEach(function(item) {
              // if track found
              if ( (item.disc_number == parseInt(track.match(re2)[1] || 1) ) && 
                (item.track_number == parseInt(track.match(re2)[3]) ) ) {
                item.fs_path = track_file; 
                item.url_path = `http://localhost:${port}/music/${album.id}/${item.disc_number}/${item.track_number}`;
                item.ctime = fs.statSync(track_file).ctime
                item.mtime = fs.statSync(track_file).mtime
              }
            });
          });

          album.tracks.local_total = album.tracks.items.filter(item => 'url_path' in item).length
          album.tracks.total_duration_ms = findTotalDurationMillis(album.tracks.items)
          json.music.push(album);
        });
      } catch(e) {
        return true; // skip the album if there is a problem fetching metadata
      }
    }) // end of .mapSeries()
    .then(function(music){
      fs.writeFile('./data/music.json', JSON.stringify(json, 0, 4), 'utf8', (err)=>{
        if(err) console.log(err)
        else console.log('[MUSIC] File saved');
        resolve(json);
      })
    })
    .catch(function(err){
      console.log('Music metadata could not be generated due to some error', err);
    });
  });
};

console.log(figlet.textSync('homehost', 
  {
    font: 'Larry 3D',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }
));

app.listen(port, () => console.log(`Listening on port ${port}`));
console.log(`Current NODE_ENV is ${process.env.NODE_ENV}`);

console.log(app._router.stack          // registered routes
  .filter(r => r.route)    // take out all the middleware
  .map(r => `**GET** ${r.route.path}`))  // get all the paths