# homehost (in beta)

[![contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ridhwaans/homehost/issues)
[![release](https://img.shields.io/github/release/ridhwaans/homehost.svg)](https://gitHub.com/ridhwaans/homehost/releases/)
[![tag](https://img.shields.io/github/tag/ridhwaans/homehost.svg)](https://gitHub.com/ridhwaans/homehost/tags/)
[![commits-since](https://img.shields.io/github/commits-since/ridhwaans/homehost/v0.9.9-beta.svg)](https://gitHub.com/ridhwaans/homehost/commit/)
[![license](https://img.shields.io/github/license/ridhwaans/homehost.svg)](https://github.com/ridhwaans/homehost/blob/master/LICENSE)

Self-hosted Netflix-like app in React  

![homehost](https://raw.githubusercontent.com/ridhwaans/homehost/master/media/movies-page-alpha.png)

<p style="align: center;"> Made for <img src="/media/chrome.svg"  width="25" height="25"></p>

## 0.9.9-BETA

### What's new

- New react soundplayer controls in album Detail view
- react streaming audio from cdn preview urls for albums

### Improvements

- Removed unused app resources
- various minor fixes

### Bugs

- Music playbutton toggle doesnt work correctly
- track number 0 urls are null for certain albums
- css module loader doesnt change based on Detail View change

### v1.0.0 Launch milestones

- ~~Finish Album detail view redesign v1~~
- add react album streaming support from host server urls
- ~~get music player controls to work in react component~~
- add support for single-disc and compilation albums
- cleanup utils & dependencies


## Setup

### Naming conventions

**Movies** `movie_file_name.<TMDB_movieID>(.mp4|.mkv)`  
**Music** `album_folder_name <Spotify_albumID> \ <track_number> track_file_name(.mp3)`

### Server-side

In `./config.yml`, set the media paths, and specify a working API key for TMDB and Spotify Web API
```yaml
# Server-side configs
movies:
  path  : '/path/to/directory'
  api   : 'api.themoviedb.org/3'
  key   : '<api_key>'
music:
  path  : '/path/to/directory'
  api   : 'api.spotify.com/v1'
  key   : '<auth_token>'
```

Start the server by running `yarn dev` from the root directory

From `./server.js`, run `generateMetaData()` **ONCE**. Wait for the async operation to finish and save

Uncomment the `generateMetaData()` call and run `yarn dev`. Server should open at `http://localhost:5000/`

By default, `5000` is the nodejs server port, `3000` is the react client port

## Routes

### Server-side

**GET** `/api/hello`  
**GET** `/api/movies`  
**GET** `/api/movies/<id>`  
**GET** `/movies/<id>`  
**GET** `/api/music/`  
**GET** `/api/music/albums/<id>`  
**GET** `/music/albums/:album_id/tracks/:track_number` (in development)  

### Client-side

`/Movies` and `/Music` are scheduled for v1.0 release. `/Books` and `/Comics` are TODO in the future

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Powered by
<p><img src="/media/spotify_green.svg"  width="200" height="150">&emsp;<img src="/media/tmdb_green.svg"  width="150" height="150"></p>

