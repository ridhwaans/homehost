const shuffleArr = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const format = (result) => {
  try {
    if (!result) return result;
    if (Array.isArray(result)) {
      result.map((i) => {
        format(i);
      });
    }
    if (Object.keys(result).length) {
      if (result.tmdb_id) {
        result.id = result.tmdb_id;
        delete result.tmdb_id;
        delete result.movie_tmdb_id;
        delete result.tv_show_tmdb_id;
        delete result.season_tmdb_id;
        delete result.fs_path;

        if (result.credits) {
          result.credits = result.credits.reduce(
            (acc, credit) => {
              if (credit.character) acc.cast.push(credit);
              if (credit.job) acc.crew.push(credit);
              return acc;
            },
            { cast: [], crew: [] }
          );
          result.credits.cast.sort((a, b) => a.order - b.order);
        }
      }
      if (result.spotify_id) {
        result.id = result.spotify_id;
        delete result.spotify_id;
        delete result.fs_path;

        if (result.album) {
          result.album_name = result.album.name;
          result.album_image_url = result.album.image_url;
          result.artists = result.album.artists;
          delete result.album;
        }

        if (result.album_type) {
          result.songs.map((s) => {
            s.album_name = result.name;
            s.album_image_url = result.image_url;
          });
        }

        if (result.songs) {
          result.songs.sort(
            (a, b) =>
              a.disc_number - b.disc_number || a.track_number - b.track_number
          );
        }
      }
      Object.entries(result).forEach(([key, value]) => {
        if (Array.isArray(value)) format(value);
      });
    }
    return result;
  } catch (e) {
    console.log('There was a problem', e);
  }
};

module.exports = { shuffleArr, format };
