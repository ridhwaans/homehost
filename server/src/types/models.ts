import { Movie } from '@prisma/client';

export type PathType = string | undefined;

export type ServiceReturnType = {
  success: boolean;
  error?: any;
  data?: any;
};
