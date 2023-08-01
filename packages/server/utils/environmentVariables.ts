import { configDotenv } from 'dotenv';

configDotenv();

export const DISABLE_SYNC_ENV = process.env.DISABLE_SYNC ?? false;
export const MOVIES_PATH_ENV = process.env.MOVIES_PATH ?? '';
export const TV_PATH_ENV = process.env.TV_PATH ?? '';
export const MUSIC_PATH_ENV = process.env.MUSIC_PATH ?? '';
