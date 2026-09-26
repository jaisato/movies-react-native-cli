import { TMDB_API_KEY } from './env';

export const API_HOST = 'https://api.themoviedb.org/3';

// The TMDb key lives in src/utils/env.js, which is git-ignored, so it never
// goes into version control: see src/utils/env.example.js and the README.
// Fail loudly at startup instead of letting every request come back as 401.
if (typeof TMDB_API_KEY !== 'string' || TMDB_API_KEY.trim() === '') {
  throw new Error(
    'TMDB_API_KEY is empty. Copy src/utils/env.example.js to src/utils/env.js ' +
      '(`npm run setup:env` does it) and set your TMDb API key there.',
  );
}

export const API_KEY = TMDB_API_KEY;
export const LANG = 'es-ES';
export const BASE_PATH_IMG = 'https://image.tmdb.org/t/p';
