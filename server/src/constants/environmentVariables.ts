import { configDotenv } from 'dotenv';
import { DEV_ENV } from './constants';

configDotenv();

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || DEV_ENV;
export const DATABASE_URL_ENV = process.env.DATABASE_URL || '';
export const DISABLE_SYNC_ENV = process.env.DISABLE_SYNC ?? false;
export const MOVIES_PATH_ENV = process.env.MOVIES_PATH ?? '';
export const TV_PATH_ENV = process.env.TV_PATH ?? '';
export const MUSIC_PATH_ENV = process.env.MUSIC_PATH ?? '';
