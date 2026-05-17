// SECURITY: API keys should be provided via environment variables
// or a build-time config system (e.g., react-native-config).
// Do NOT commit real API keys to source control.
export const API_HOST = 'https://api.themoviedb.org/3';
export const API_KEY = process.env.TMDB_API_KEY || 'REPLACE_WITH_ENV_VAR';
export const LANG = 'es-ES';
export const BASE_PATH_IMG = 'https://image.tmdb.org/t/p';
