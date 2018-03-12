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

- Music Grid is functional
- New music album Detail view
- unique color palettes for album select

### Bug fixes/ improvements

- Streamlined metadata generation for media in node
- Removed unused app resources
- various minor fixes

### Launch milestones

- Album detail view redesign v1
- add cdn previews and react streaming support for album hosting
- add support for single-disc and compilation albums
- cleanup utils & dependencies


## Setup

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

