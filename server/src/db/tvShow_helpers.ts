import { Genre, TVShow } from '@prisma/client';
import { shuffleArr } from '../utils';
import { GenresModel, SeasonsModel, TvShowsModel } from './prismaClient';
import { PathType } from '../types';

export const getAllTVShows = async (): Promise<TVShow[]> => {
  const result = await TvShowsModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
  });
  return result;
};

export const getMostPopularTVShows = async (): Promise<TVShow[]> => {
  const result = await TvShowsModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    orderBy: {
      popularity: 'desc',
    },
    take: 25,
  });
  return result;
};

export const getHighestRatedTVShows = async (): Promise<TVShow[]> => {
  const result = await TvShowsModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    orderBy: {
      vote_average: 'desc',
    },
    take: 25,
  });
  return result;
};

// export const lastAddedEpisode = (tv_show: TVShow) => {
//   return Math.max(
//     ...tv_show.seasons.map((s) => s.episodes.map((e) => e.mtime)).flat(Infinity)
//   );
// };

// export const getRecentlyAddedTVShows = async (): Promise<TVShow[]> => {
//   const result = await TvShowsModel.findMany({
//     include: {
//       genres: true,
//       production_companies: true,
//       seasons: { include: { episodes: true } },
//       credits: true,
//       similar: true,
//     },
//   });
//   return result.sort((a, b) => lastAddedEpisode(b) - lastAddedEpisode(a));
// };

export const getTVShowGenres = async (): Promise<Genre[]> => {
  const result = await GenresModel.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return result;
};

export const getTVShowsByGenre = async (
  genre_name: string
): Promise<TVShow[]> => {
  const result = await TvShowsModel.findMany({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
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
  // TODO: shuffleArr
  // return shuffleArr(format(result));
  return result;
};

export const getTVShow = async (tv_show_id: number) => {
  const result = await TvShowsModel.findUnique({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    where: {
      tmdb_id: tv_show_id,
    },
  });
  return result;
};

export const getEpisodeFilePath = async (
  tv_show_id: string,
  season_number: number,
  episode_number: number
): Promise<PathType> => {
  const result = await SeasonsModel.findUnique({
    select: {
      episodes: {
        where: {
          episode_number: episode_number,
        },
        select: {
          fs_path: true,
        },
      },
    },
    where: {
      tv_show_tmdb_id_season_number: {
        tv_show_tmdb_id: parseInt(tv_show_id),
        season_number: season_number,
      },
    },
  });
  return result?.episodes[0].fs_path;
};

export const getRandomTVShow = async (): Promise<TVShow | null> => {
  const id = Math.floor(Math.random() * (await TvShowsModel.count())) + 1;
  const result = await TvShowsModel.findUnique({
    include: {
      genres: true,
      production_companies: true,
      seasons: { include: { episodes: true } },
      credits: true,
      similar: true,
    },
    where: {
      id: id,
    },
  });
  return result;
};
