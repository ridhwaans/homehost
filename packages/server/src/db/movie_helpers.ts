import { shuffleArr } from '../utils';
import { GenresModel, MoviesModel } from './prismaClient';

export const getAllMovies = async () => {
  const result = await MoviesModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
  });
  return result;
  // return format(result);
};

export const getMostPopularMovies = async () => {
  const result = await MoviesModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    orderBy: {
      popularity: 'desc',
    },
    take: 25,
  });
  // return format(result);
  return result;
};

export const getHighestRatedMovies = async () => {
  const result = await MoviesModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    orderBy: {
      vote_average: 'desc',
    },
    take: 25,
  });
  // return format(result);
  return result;
};

export const getRecentlyAddedMovies = async () => {
  const result = await MoviesModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    orderBy: {
      ctime: 'desc',
    },
    take: 25,
  });
  return result;
  // return format(result);
};

export const getMovieGenres = async () => {
  const result = await GenresModel.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  // return format(result);
  return result;
};

export const getMoviesByGenre = async (genre_name: string) => {
  const result = await MoviesModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    where: {
      genres: {
        some: {
          name: genre_name,
        },
      },
    },
  });
  // return shuffleArr(format(result));
  return result;
};

export const getMovie = async (movie_id: number) => {
  const result = await MoviesModel.findUnique({
    include: {
      genres: true,
      production_companies: true,
      credits: true,
      similar: true,
    },
    where: {
      tmdb_id: movie_id,
    },
  });
  // return format(result);
  return result;
};

export const getMovieFilePath = async (movie_id: number) => {
  const result = await MoviesModel.findUnique({
    select: {
      fs_path: true,
    },
    where: {
      tmdb_id: movie_id,
    },
  });
  return result?.fs_path;
};
