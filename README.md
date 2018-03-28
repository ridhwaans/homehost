<p style="text-align: center;">
<img src="media/v1-homehost-logo-1.PNG" alt="homehost logo">

<p align="center">
  <a href="https://github.com/ridhwaans/homehost/issues"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="contributions"></a>
  <a href="https://github.com/ridhwaans/homehost/releases/"><img src="https://img.shields.io/github/release/ridhwaans/homehost.svg" alt="release"></a>
  <a href="https://github.com/ridhwaans/homehost/tags/"><img src="https://img.shields.io/github/tag/ridhwaans/homehost.svg" alt="tag"></a>
  <a href="https://github.com/ridhwaans/homehost/commit/"><img src="https://img.shields.io/github/commits-since/ridhwaans/homehost/v1.0.0-BETA.svg" alt="commits-since"></a>
  <a href="https://github.com/ridhwaans/homehost/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ridhwaans/homehost.svg" alt="license"></a>
</p>

<h3 align="center"> homehost is made for streaming your media collection over the home network</h3>
<h4 align="center"> Features: 🎥 Movies, 🎵 Music, 📺 TV Shows, 📚 Books, 📒 Comics, 🎙️ Podcasts </h4>

# 🎥 Movies
![movies](media/v1-movies-1.PNG)
## Demo
![movies-gif](media/v1-movies-demo-min-1.gif)
# 🎵 Music
![music](media/v1-music-1.PNG)
## Demo
![music-gif](media/v1-music-demo-min-1.gif)

# Setup

In `./config.yml`, set the media paths, and specify a working API key for TMDB API and Spotify Web API
```yaml
# Server-side configs
movies:
  path  : '/path/to/movies/directory'
  api   : 'api.themoviedb.org/3'
  key   : '<api_key>'
music:
  path  : '/path/to/music/directory'
  api   : 'api.spotify.com/v1'
  key   : '<auth_token>'
```
If you dont have keys, you can request API authentication from Spotify at https://beta.developer.spotify.com/documentation/web-api/, and TMDB at https://developers.themoviedb.org/3/getting-started/introduction

## Naming conventions

Your media must appear in the path set by `config.yml`  
🎥 **Movies**  
```
<movies_path>  
 - (subdirectory)?  
   - (movie_file_name <TMDB-movie-ID>) (.mp4|.mkv)
```
🎵 **Music**  
```
<music_path>  
 - (album_directory_name <Spotify-album-ID>)  
   - ((<disc_number>-)?<track_number> track_file_name) (.mp3)
```
Tracks not found on Spotify can be put in a directory titled `Unknown Album` sans disc/ track number
```
<music_path>  
 - Unknown Album  
   - (track_file_name) (.mp3)
```
## Generating metadata

Server requires `<media>.json` file data at startup. Initial json state should be empty
```json
./movies.json & ./music.json
{
  "movies": [], "music": []
}
```
Start homehost by running `yarn homehost` from the base directory. Server should open at `http://localhost:5000/`  
On the server, call `/api/generate` **once**. Wait for the async operation to finish and save  
**NOTE:** `nodemon` interrupts async data generation upon file save. Use `node server` instead for generating metadata  
By default, `5000` is the nodejs server port, `3000` is the react client port

## Routes

### Server-side

**GET** `/api/hello`  
**GET** `/api/generate`  
**GET** `/api/movies`  
**GET** `/api/movies/:id`  
**GET** `/movies/:id`  
**GET** `/api/music/`  
**GET** `/api/music/albums/:id`  
**GET** `/music/:album_id/:disc_number/:track_number`

### Client-side

`/movies` and `/music` are scheduled for v1.0 release. `/books`, `/comics`, `/podcasts`, `/tv` are TODO

# Powered by
<p><img src="media/spotify_green.svg"  width="200" height="150">&emsp;<img src="media/tmdb_green.svg"  width="150" height="150"></p>

# License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

# Disclaimer

All pictures copyright to their respective owner(s). This project does not claim ownership of any of the pictures displayed on this site unless stated otherwise. This project does not knowingly intend or attempt to offend or violate any copyright or intellectual property rights of any entity. Some images used on this project are taken from the web and believed to be in the public domain. In addition, to the best of this project's knowledge, all content, images, photos, etc., if any, are being used in compliance with the Fair Use Doctrine (Copyright Act of 1976, 17 U.S.C. § 107.) The pictures are provided for comment/criticism/news reporting/educational purposes only.

Where every care has been taken to ensure the accuracy of the contents of this project, we do not warrant its completeness, quality and accuracy, nor can we guarantee that it is up-to-date. We will not be liable for any consequences arising from the use of, or reliance on, the contents of this project. The respective owners are exclusively responsible for external websites. This project accepts no liability of the content of external links.

Our project follows the safe harbor provisions of 17 U.S.C. §512, otherwise known as Digital Millennium Copyright Act (“DMCA”).

If any images posted here are in violation of copyright law, please contact us and we will gladly remove the offending images immediately upon receipt of valid proof of copyright infringement.

## General Copyright Statement  
Most of the sourced material is posted according to the “fair use” doctrine of copyright law for non-commercial news reporting, education and discussion purposes. We comply with all takedown requests.

You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).