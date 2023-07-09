export interface Movie {
  id: number;
  type: string;
  url_path: string;
  ctime: string;
  mtime: string;
  adult: boolean;
  backdrop_path: string;
  budget: number;
  imdb_id: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: string;
  runtime: number;
  tagline?: string | null;
  title: string;
  vote_average: number;
  vote_count: number;
  logo_path?: string | null;
  genres?: (GenresEntity)[] | null;
  production_companies?: (ProductionCompaniesEntity)[] | null;
  credits: Credits;
  similar?: (SimilarEntity)[] | null;
}
export interface GenresEntity {
  id: number;
  name: string;
}
export interface ProductionCompaniesEntity {
  id: number;
  logo_path?: string | null;
  name: string;
  origin_country: string;
}
export interface Credits {
  cast?: (CastEntity)[] | null;
  crew?: (CrewEntity)[] | null;
}
export interface CastEntity {
  id: number;
  movie_tmdb_id: number;
  tv_show_tmdb_id?: null;
  tmdb_id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path?: string | null;
  character: string;
  credit_id: string;
  order: number;
  department?: null;
  job?: null;
}
export interface CrewEntity {
  id: number;
  movie_tmdb_id: number;
  tv_show_tmdb_id?: null;
  tmdb_id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path?: string | null;
  character?: null;
  credit_id: string;
  order?: null;
  department: string;
  job: string;
}
export interface SimilarEntity {
  id: number;
  title: string;
  name?: null;
  release_date: string;
  first_air_date?: null;
  overview: string;
  backdrop_path: string;
  poster_path: string;
}
