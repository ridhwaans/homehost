import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient();

export const {
  movie: MoviesModel,
  genre: GenresModel,
  tVShow: TvShowsModel,
  season: SeasonsModel,
  episode: EpisodesModel,
  artist: ArtistsModel,
  album: AlbumsModel,
  song: SongsModel,
  notAvailable: NotAvailableModel,
} = prismaClient;
