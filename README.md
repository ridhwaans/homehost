# homehost

<p align="center">
  <a href="https://github.com/ridhwaans/homehost/releases/"><img src="https://img.shields.io/github/release/ridhwaans/homehost.svg" alt="release"></a>
  <a href="https://github.com/ridhwaans/homehost/tags/"><img src="https://img.shields.io/github/tag/ridhwaans/homehost.svg" alt="tag"></a>
  <a href="https://github.com/ridhwaans/homehost/commit/"><img src="https://img.shields.io/github/commits-since/ridhwaans/homehost/client-v1.1.0.svg" alt="commits-since"></a>
  <a href="https://github.com/ridhwaans/homehost/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ridhwaans/homehost.svg" alt="license"></a>
</p>

<h3 align="center"> homehost is made for streaming your media collection over the home network </h3>
<h4 align="center"> Features: 🎥 Movies, 🎵 Music, 📺 TV Shows, 📚 Books, 📒 Comics, 🎙️ Podcasts </h4>

## 🎥 Movies
![movies](media/v1-movies-1.PNG)
### [Demo](https://homehost-demo.herokuapp.com/movies)
[![movies-gif](media/v1-movies-demo-1.gif)](https://homehost-demo.herokuapp.com/movies)
## 🎵 Music
![music](media/v1-music-1.PNG)
### [Demo](https://homehost-demo.herokuapp.com/music)
[![music-gif](media/v1-music-demo-1.gif)](https://homehost-demo.herokuapp.com/music)

## Setup

Run `npm install` in the `client/` directory and the `server/` directory
Create a `.env` file in the `client/` directory, if it does not exist
In `.env`, set the base url of the homehost server 
###### **`.env`**
```env
REACT_APP_HOMEHOST_API = "http://localhost:5000/api"
REACT_APP_IMAGE_BASE = "https://image.tmdb.org/t/p/"
REACT_APP_TMDB_BASE = "https://www.imdb.com/title/"
```  
Create a `.env` file in the `server/` directory, if it does not exist  
In `.env`, set the media paths, and set a working API key for TMDb API and Spotify Web API  
###### **`.env`**
```env
MOVIES_PATH = '/path/to/movies/directory'
MOVIES_API = 'api.themoviedb.org/3'
MOVIES_KEY = '<api_key>'

TV_PATH = '/path/to/tv/directory'
TV_API = 'api.themoviedb.org/3'
TV_KEY = '<api_key>'

MUSIC_PATH = '/path/to/music/directory'
MUSIC_API = 'api.spotify.com/v1'
MUSIC_KEY = '<api_key>'

CLIENT_BASE = 'http://localhost:3000'
```
If you dont have keys, you can request API authorization from Spotify at https://developer.spotify.com/documentation/web-api/, and TMDb at https://developers.themoviedb.org/3/getting-started/introduction  

### Naming conventions

Your media must appear in the path set by `.env`  
🎥 **Movies**  
```
<movies_path>  
 - (subdirectory)?  
   - (movie_file_name <TMDb-movie-ID>) (.mp4|.mkv)  
```
📺 **TV**  
```
<tv_path>  
 - (tv_show_directory_name <TMDb-tv-ID>)  
   - (S<season_number>E<episode_number> episode_file_name) (.mp4|.mkv)
```
🎵 **Music**  
```
<music_path>  
 - (album_directory_name <Spotify-album-ID>)  
   - ((<disc_number>-)?<track_number> track_file_name) (.mp3|.flac)  
```
Tracks not found on Spotify can be put in a directory titled `Unknown Album` sans disc/ track number
```
<music_path>  
 - Unknown Album  
   - (track_file_name) (.mp3|.flac)
```

### Generating metadata
 
Run `npm run start-dev` from the `server/` directory   
 
On the server, call `/api?generate` **once**. Wait for the async call to finish and save  
There is no 'watch' or 'hot reload' for server media. Adding or removing media files requires a server reset and recalling `/api?generate`  
<!-- `nodemon` will restart to file changes and interrupt async. Use `node server` instead for generating metadata.  
Run `ncu` in the base directory and in the `client/` directory to check for updates for `package.json`  -->

### Run

Run `npm run start-dev` from the `server/` directory to start the application  
By default the server port is `5000`, client port is `3000`  
 
### Routes

#### Server-side

**GET** /api
**GET** /api/about
**GET** /api/movies
**GET** /api/tv
**GET** /api/music
**GET** /api/movies/most_popular
**GET** /api/movies/highest_rated
**GET** /api/movies/recently_added
**GET** /api/movies/genres
**GET** /api/movies/genres/:name
**GET** /api/movies/random
**GET** /api/movies/:id
**GET** /api/tv/most_popular
**GET** /api/tv/highest_rated
**GET** /api/tv/recently_added
**GET** /api/tv/genres
**GET** /api/tv/genres/:name
**GET** /api/tv/random
**GET** /api/tv/:id
**GET** /api/music/albums/:id
**GET** /movies/:id
**GET** /tv/:tv_id/:season_number/:episode_number
**GET** /music/:album_id/:disc_number/:track_number

#### Client-side

`/movies`, `/tv`, `/music`  
TODO `/books`, `/comics`, `/podcasts`  

## Development

Works best in <img src="media/chrome.svg" width="16" height="16" title="Google Chrome"> Chrome. Coming to Desktop, iOS, Android.

## Powered by

<p><img src="media/spotify_green.svg" width="200" height="150" title="Spotify Web API">&emsp;<img src="media/tmdb_green.svg" width="150" height="150" title="TMDb API"></p>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Disclaimer

All pictures copyright to their respective owner(s). This project does not claim ownership of any of the pictures displayed on this site unless stated otherwise. This project does not knowingly intend or attempt to offend or violate any copyright or intellectual property rights of any entity. Some images used on this project are taken from the web and believed to be in the public domain. In addition, to the best of this project's knowledge, all content, images, photos, etc., if any, are being used in compliance with the Fair Use Doctrine (Copyright Act of 1976, 17 U.S.C. § 107.) The pictures are provided for comment/criticism/news reporting/educational purposes only.

Where every care has been taken to ensure the accuracy of the contents of this project, we do not warrant its completeness, quality and accuracy, nor can we guarantee that it is up-to-date. We will not be liable for any consequences arising from the use of, or reliance on, the contents of this project. The respective owners are exclusively responsible for external websites. This project accepts no liability of the content of external links.

Our project follows the safe harbor provisions of 17 U.S.C. §512, otherwise known as Digital Millennium Copyright Act (“DMCA”).

If any images posted here are in violation of copyright law, please contact us and we will gladly remove the offending images immediately upon receipt of valid proof of copyright infringement.

### General Copyright Statement  
Most of the sourced material is posted according to the “fair use” doctrine of copyright law for non-commercial news reporting, education and discussion purposes. We comply with all takedown requests.

You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).