import {
  AlbumsModel,
  ArtistsModel,
  EpisodesModel,
  MoviesModel,
  NotAvailableModel,
  SeasonsModel,
  SongsModel,
  TvShowsModel,
} from './prismaClient';
import { shuffleArr } from '../utils';
// import { Metadata } from '../services/metadata';
// import { getRandomTVShow } from './tvShow_helpers';
import { Movie, TVShow } from '@prisma/client';

// const metadataService = new Metadata();

export const getAbout = () => {
  return {
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  };
};

export const getLibraryStats = async () => {
  return {
    movies: await MoviesModel.count(),
    tv_shows: await TvShowsModel.count(),
    seasons: await SeasonsModel.count(),
    episodes: await EpisodesModel.count(),
    artists: await ArtistsModel.count(),
    albums: await AlbumsModel.count(),
    songs: await SongsModel.count(),
    not_available: await NotAvailableModel.count(),
  };
};

export const getAllNotAvailable = async () => {
  const result = await NotAvailableModel.findMany();
  return result;
};

// export const externalSearch = async (type, keyword) => {
//   return await metadataService.search(type, keyword);
// };

export const searchMoviesAndTV = async (keyword: string) => {
  const movies = await MoviesModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    where: {
      OR: [
        { title: { contains: keyword } },
        { tagline: { contains: keyword } },
        { overview: { contains: keyword } },
        {
          credits: {
            some: {
              name: { contains: keyword },
            },
          },
        },
      ],
    },
  });
  const tv_shows = await TvShowsModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    where: {
      OR: [
        { name: { contains: keyword } },
        { tagline: { contains: keyword } },
        { overview: { contains: keyword } },
        {
          seasons: {
            some: {
              OR: [
                { name: { contains: keyword } },
                { overview: { contains: keyword } },
                {
                  episodes: {
                    some: {
                      OR: [
                        { name: { contains: keyword } },
                        { overview: { contains: keyword } },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          credits: {
            some: {
              name: { contains: keyword },
            },
          },
        },
      ],
    },
  });
  const tv_and_movies: (TVShow | Movie)[] = [];
  const results = shuffleArr(tv_and_movies.concat(tv_shows).concat(movies));
  return {
    results: results,
    count: results.length,
  };
};

// export const getRandomMovieOrTVShow = async (): Promise<TVShow | Movie> => {
//   const ratio = (await TvShowsModel.count()) / (await MoviesModel.count());
//   const result =
//     (await Math.random()) < ratio
//       ? await getRandomTVShow()
//       : await getRandomMovie();
//   return result;
// };

// export const getRandomMovie = async (): Promise<Movie> => {
//   const id = Math.floor(Math.random() * (await MoviesModel.count())) + 1;
//   const result = await MoviesModel.findUnique({
//     include: {
//       genres: true,
//       production_companies: true,
//       credits: true,
//       similar: true,
//     },
//     where: {
//       id: id,
//     },
//   });
//   return format(result);
// };
