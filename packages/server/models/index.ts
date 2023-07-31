const fs = require('fs');
const path = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const metadataServiceConstructor = require('../services/metadata');
const metadataService = new metadataServiceConstructor();
const { Type } = require('../constants');

const getMovieMetaData = async (file) => {
  try {
    let re = new RegExp(/(\d+)(.mp4|.mkv)$/); // movie_id

    console.log('GET: ' + file);
    let movie = await metadataService.get({
      type: Type.Movie,
      id: file.match(re)[1],
    });
    if (movie.status == 404 || movie.status_code == 34)
      throw 'API resource was not found';

    let logo = movie.images.logos.find((logo) => logo.iso_639_1 == 'en');
    return {
      type: Type.Movie,
      tmdb_id: movie.id,
      fs_path: file,
      url_path: `/movies/${movie.id}`,
      ctime: fs.statSync(file).ctime,
      mtime: fs.statSync(file).mtime,
      adult: movie.adult,
      backdrop_path: movie.backdrop_path,
      budget: movie.budget,
      genres: movie.genres.map((genre) => ({
        tmdb_id: genre.id,
        name: genre.name,
      })),
      imdb_id: movie.imdb_id,
      overview: movie.overview,
      popularity: movie.popularity,
      poster_path: movie.poster_path,
      production_companies: movie.production_companies.map(
        (production_company) => ({
          tmdb_id: production_company.id,
          logo_path: production_company.logo_path,
          name: production_company.name,
          origin_country: production_company.origin_country,
        })
      ),
      release_date: movie.release_date,
      revenue: movie.revenue,
      runtime: movie.runtime,
      tagline: movie.tagline ? movie.tagline : undefined,
      title: movie.title,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      logo_path: logo ? logo.file_path : undefined,
      credits: movie.credits.cast.concat(movie.credits.crew).map((credit) => ({
        tmdb_id: credit.id,
        adult: credit.adult,
        gender: credit.gender,
        known_for_department: credit.known_for_department,
        name: credit.name,
        popularity: credit.popularity,
        profile_path: credit.profile_path,
        character: credit.character,
        credit_id: credit.credit_id,
        order: credit.order,
        department: credit.department,
        job: credit.job,
      })),
      similar: movie.similar.results
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 4)
        .map((similar_result) => ({
          tmdb_id: similar_result.id,
          backdrop_path: similar_result.backdrop_path,
          title: similar_result.title,
          name: similar_result.name,
          release_date: similar_result.release_date,
          overview: similar_result.overview,
          poster_path: similar_result.poster_path,
        })),
    };
  } catch (e) {
    return { status: 400, fs_path: file };
  }
};

const getTVEpisodeMetaData = async (file) => {
  try {
    let re = new RegExp(/(\d+)$/); // tv_show_id
    let re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/i); // S(season_number)E(episode_number)

    console.log('GET: ' + file);
    // find tv episode on TMDb
    let tv_show_id = parseInt(path.dirname(file).match(re)[1]);
    let season_number = parseInt(file.match(re2)[1]);
    let episode_number = parseInt(file.match(re2)[2]);
    let episode = await metadataService.get({
      type: Type.TV.Episode,
      tv_show_id: tv_show_id,
      season_number: season_number,
      episode_number: episode_number,
    });
    if (episode.status == 404 || episode.status_code == 34)
      throw 'API resource was not found';

    return {
      type: Type.TV.Episode,
      tmdb_id: episode.id,
      fs_path: file,
      url_path: `/tv/${tv_show_id}/${episode.season_number}/${episode.episode_number}`,
      ctime: fs.statSync(file).ctime,
      mtime: fs.statSync(file).mtime,
      air_date: episode.air_date,
      episode_number: episode.episode_number,
      name: episode.name,
      overview: episode.overview,
      season_number: episode.season_number,
      still_path: episode.still_path || '',
      vote_average: episode.vote_average,
      vote_count: episode.vote_count,
    };
  } catch (e) {
    return { status: 400, fs_path: file };
  }
};

const getTVShowMetaData = async (file) => {
  try {
    let re = new RegExp(/(\d+)$/); // tv_show_id
    let re2 = new RegExp(/S(\d{1,2})E(\d{1,2})/i); // S(season_number)E(episode_number)

    console.log('GET: ' + file);
    // find tv show on TMDb
    let tv_show_id = parseInt(path.dirname(file).match(re)[1]);
    let season_number = parseInt(file.match(re2)[1]);
    let episode_number = parseInt(file.match(re2)[2]);
    let tv_show = await metadataService.get({
      type: Type.TV.Show,
      id: tv_show_id,
    });
    if (tv_show.status == 404 || tv_show.status_code == 34)
      throw 'API resource was not found';

    let episode = await getTVEpisodeMetaData(file);
    if (episode.status == 400) throw 'API resource was not found';

    tv_show.seasons = tv_show.seasons.filter(
      (season) => season.season_number == season_number.toString()
    );
    let logo = tv_show.images.logos.find((logo) => logo.iso_639_1 == 'en');

    return {
      type: Type.TV.Show,
      tmdb_id: tv_show.id,
      backdrop_path: tv_show.backdrop_path,
      created_by: tv_show.created_by.map((creator) => ({
        tmdb_id: creator.id,
        credit_id: creator.credit_id,
        name: creator.name,
        gender: creator.gender,
        profile_path: creator.profile_path,
      })),
      genres: tv_show.genres.map((genre) => ({
        tmdb_id: genre.id,
        name: genre.name,
      })),
      name: tv_show.name,
      overview: tv_show.overview,
      popularity: tv_show.popularity,
      poster_path: tv_show.poster_path,
      production_companies: tv_show.production_companies.map(
        (production_company) => ({
          tmdb_id: production_company.id,
          logo_path: production_company.logo_path,
          name: production_company.name,
          origin_country: production_company.origin_country,
        })
      ),
      seasons: tv_show.seasons.map((season) => ({
        tmdb_id: season.id,
        air_date: season.air_date,
        name: season.name,
        overview: season.overview,
        poster_path: season.poster_path,
        season_number: season.season_number,
        episodes: [episode],
      })),
      tagline: tv_show.tagline ? tv_show.tagline : undefined,
      vote_average: tv_show.vote_average,
      vote_count: tv_show.vote_count,
      logo_path: logo ? logo.file_path : undefined,
      credits: tv_show.credits.cast
        .concat(tv_show.credits.crew)
        .map((credit) => ({
          tmdb_id: credit.id,
          adult: credit.adult,
          gender: credit.gender,
          known_for_department: credit.known_for_department,
          name: credit.name,
          popularity: credit.popularity,
          profile_path: credit.profile_path,
          character: credit.character,
          credit_id: credit.credit_id,
          order: credit.order,
          department: credit.department,
          job: credit.job,
        })),
      similar: tv_show.similar.results
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 4)
        .map((similar_result) => ({
          tmdb_id: similar_result.id,
          backdrop_path: similar_result.backdrop_path,
          title: similar_result.title,
          name: similar_result.name,
          first_air_date: similar_result.first_air_date,
          overview: similar_result.overview,
          poster_path: similar_result.poster_path,
        })),
      imdb_id: tv_show.external_ids.imdb_id,
    };
  } catch (e) {
    return { status: 400, fs_path: file };
  }
};

const getLastUnknownAlbumTrackNumber = async () => {
  const last = await prisma.song.aggregate({
    where: { album_spotify_id: unknown_id },
    _max: {
      track_number: true,
    },
  });
  return last._max.track_number;
};

const getUnknownAlbumMetaData = async (file) => {
  let re = new RegExp(/(\w+)$/); // album_id
  let re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
  unknown_album = 'Unknown Album';
  unknown_id = 'no_spotify_id';

  console.log('GET: ' + file);
  // build music album not on Spotify
  let disc_number = 1;
  let track_number = await getLastUnknownAlbumTrackNumber();
  track_number = track_number ? track_number + 1 : 1;

  return {
    type: Type.Music.Album,
    spotify_id: unknown_id,
    album_type: 'compilation',
    artists: [
      {
        type: Type.Music.Artist,
        spotify_id: unknown_id,
        name: 'Unknown Artist',
        image_url: 'http://i.imgur.com/bVnx0IY.png',
      },
    ],
    image_url: 'http://i.imgur.com/bVnx0IY.png',
    label: 'Unknown Label',
    name: unknown_album,
    popularity: undefined,
    release_date: '',
    songs: [
      {
        artists: [
          {
            type: Type.Music.Artist,
            spotify_id: unknown_id,
            name: 'Unknown Artist',
            image_url: 'http://i.imgur.com/bVnx0IY.png',
          },
        ],
        spotify_id: `${unknown_id}_${track_number}`,
        name: path.basename(file).replace(/.mp3|.flac/gi, ''),
        disc_number: disc_number,
        track_number: track_number,
        fs_path: file,
        url_path: `/music/${unknown_id}/${disc_number}/${track_number}`,
        ctime: fs.statSync(file).ctime,
        mtime: fs.statSync(file).mtime,
        duration_ms: parseInt((await getAudioDurationInSeconds(file)) * 1000),
        explicit: false,
        preview_url: undefined,
      },
    ],
    total_tracks: track_number,
  };
};

const getAlbumMetaData = async (file) => {
  try {
    let re = new RegExp(/(\w+)$/); // album_id
    let re2 = new RegExp(/((\d+)-)?(\d+)/); // disc_number - track_number
    unknown_album = 'Unknown Album';

    console.log('GET: ' + file);

    let album_path = path.dirname(file);
    if (album_path.toUpperCase().endsWith(unknown_album.toUpperCase())) {
      return getUnknownAlbumMetaData(file);
    }

    // find the Spotify music album
    let album = await metadataService.get({
      type: Type.Music.Album,
      id: album_path.match(re)[1],
    });
    if (album.error && album.error.status == 400)
      throw 'API resource was not found';

    // find missing artist(s) information for the Spotify music album
    for (var current_artist of album.artists) {
      let artist = await metadataService.get({
        type: Type.Music.Artist,
        id: current_artist.id,
      });
      current_artist.image_url = artist.images[0]
        ? artist.images[0].url
        : 'http://i.imgur.com/bVnx0IY.png';
      current_artist.popularity = artist.popularity;
    }

    // if local track found
    let disc_number = parseInt(path.basename(file).match(re2)[1] || 1);
    let track_number = parseInt(path.basename(file).match(re2)[3]);

    album.tracks.items = album.tracks.items.filter((item) => {
      if (
        item.disc_number == disc_number &&
        item.track_number == track_number
      ) {
        return true;
      }
    });
    if (album.tracks.items.length == 0) throw 'API resource was not found';
    // find missing artist(s) information for the Spotify track
    for (var track_item of album.tracks.items) {
      for (var current_artist of track_item.artists) {
        let artist = await metadataService.get({
          type: Type.Music.Artist,
          id: current_artist.id,
        });
        current_artist.image_url = artist.images[0]
          ? artist.images[0].url
          : 'http://i.imgur.com/bVnx0IY.png';
        current_artist.popularity = artist.popularity;
      }
    }

    return {
      type: Type.Music.Album,
      spotify_id: album.id,
      album_type: album.album_type,
      artists: album.artists.map((artist) => ({
        type: Type.Music.Artist,
        spotify_id: artist.id,
        name: artist.name,
        image_url: artist.image_url,
        popularity: artist.popularity,
      })),
      image_url: album.images[0].url,
      label: album.label,
      name: album.name,
      popularity: album.popularity,
      release_date: album.release_date,
      songs: album.tracks.items.map((track_item) => ({
        artists: track_item.artists.map((artist) => ({
          type: Type.Music.Artist,
          spotify_id: artist.id,
          name: artist.name,
          image_url: artist.image_url,
          popularity: artist.popularity,
        })),
        spotify_id: track_item.id,
        fs_path: file,
        url_path: `/music/${album.id}/${track_item.disc_number}/${track_item.track_number}`,
        ctime: fs.statSync(file).ctime,
        mtime: fs.statSync(file).mtime,
        disc_number: track_item.disc_number,
        duration_ms: track_item.duration_ms,
        explicit: track_item.explicit,
        name: track_item.name,
        preview_url: track_item.preview_url,
        track_number: track_item.track_number,
      })),
      total_tracks: album.total_tracks,
    };
  } catch (e) {
    return { status: 400, fs_path: file };
  }
};

const moveMovieFile = (item) => {
  try {
    // https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
    const filename = item.title.replace(/[/\\?%*:|"<>]/g, '-');
    const filetype = item.fs_path.match(/\.[0-9a-z]+$/i)[0];
    const dest = `${process.env.MOVIES_PATH}/${filename} (${item.release_year}) ${item.id}${filetype}`;

    console.log(`source: ${item.fs_path}`);
    console.log(`destination: ${dest}`);

    fs.rename(item.fs_path, dest, (err) => {
      if (err) throw err;
      console.log('Move complete');
      return { status: 200, fs_path: dest };
    });
  } catch (e) {
    console.log('There was an error moving this file');
    return { status: 500, fs_path: item.fs_path };
  }
};

const moveEpisodeFile = (item) => {
  try {
    const filetype = item.fs_path.match(/\.[0-9a-z]+$/i)[0];
    let filename;
    filename = path.basename(item.fs_path).replace(/.mp4|.mkv/gi, '');
    // https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
    filename = filename.replace(/[/\\?%*:|"<>]/g, '-');
    const dirname = `${item.tv_show_name.replace(/[/\\?%*:|"<>]/g, '-')} ${
      item.tv_show_id
    }`;
    const dest = `${process.env.TV_PATH}/${dirname}/S${item.season_number}E${item.episode_number} ${filename}${filetype}`;

    console.log(`source: ${item.fs_path}`);
    console.log(`destination: ${dest}`);

    if (!fs.existsSync(`${process.env.TV_PATH}/${dirname}`)) {
      fs.mkdirSync(`${process.env.TV_PATH}/${dirname}`);
    }
    fs.rename(item.fs_path, dest, (err) => {
      if (err) throw err;
      console.log('Move complete');
      return { status: 200, fs_path: dest };
    });
  } catch (e) {
    console.log('There was an error moving this file');
    return { status: 500, fs_path: item.fs_path };
  }
};

const moveSongFile = (item) => {
  try {
    const filetype = item.fs_path.match(/\.[0-9a-z]+$/i)[0];
    let filename;
    let dirname;
    let dest;

    if (item.album_name == 'Unknown Album') {
      filename = path.basename(item.fs_path).replace(/.mp3|.flac/gi, '');
      filename = filename.replace(/[/\\?%*:|"<>]/g, '-');
      dirname = item.album_name;
      dest = `${process.env.MUSIC_PATH}/${dirname}/${filename}${filetype}`;
    } else {
      // https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
      filename = item.name.replace(/[/\\?%*:|"<>]/g, '-');
      dirname = `${item.album_name.replace(/[/\\?%*:|"<>]/g, '-')} (${
        item.album_release_year
      }) ${item.album_id}`;
      dest = `${process.env.MUSIC_PATH}/${dirname}/${item.disc_number}-${item.track_number} ${filename}${filetype}`;
    }
    console.log(`source: ${item.fs_path}`);
    console.log(`destination: ${dest}`);

    if (!fs.existsSync(`${process.env.MUSIC_PATH}/${dirname}`)) {
      fs.mkdirSync(`${process.env.MUSIC_PATH}/${dirname}`);
    }
    fs.rename(item.fs_path, dest, (err) => {
      if (err) throw err;
      console.log('Move complete');
      return { status: 200, fs_path: dest };
    });
  } catch (e) {
    console.log('There was an error moving this file');
    return { status: 500, fs_path: item.fs_path };
  }
};

module.exports = {
  getMovieMetaData,
  getTVShowMetaData,
  getAlbumMetaData,
  moveMovieFile,
  moveEpisodeFile,
  moveSongFile,
};
