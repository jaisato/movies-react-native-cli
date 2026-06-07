export const API_HOST = 'https://api.themoviedb.org/3';
// SECURITY: API key must be loaded from environment variables, not hardcoded.
// Use react-native-config or a .env file listed in .gitignore.
export const API_KEY = process.env.TMDB_API_KEY || 'REPLACE_WITH_ENV_VAR';
export const LANG = 'es-ES';
export const BASE_PATH_IMG = 'https://image.tmdb.org/t/p';
