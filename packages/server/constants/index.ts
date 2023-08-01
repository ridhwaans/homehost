export * from './constants';
export * from './environmentVariables';

export const Type = Object.freeze({
  Movie: 'Movie',
  TV: {
    Show: 'Show',
    Season: 'Season',
    Episode: 'Episode',
  },
  Music: {
    Album: 'Album',
    Artist: 'Artist',
    Song: 'Song',
  },
});
