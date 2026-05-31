import { API_HOST, API_KEY, LANG } from '../utils/constants';

function safeFetch(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('API request failed:', error.message);
      return { results: [], genres: [] };
    });
}

export function getNewsMoviesApi(page = 1) {
  const url = `${API_HOST}/movie/now_playing?api_key=${API_KEY}&language=${LANG}&page=${page}`;
  return safeFetch(url);
}

export function getGenreMovieApi(idGenres) {
  const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;

  return safeFetch(url)
    .then((result) => {
      const arrayGenres = [];
      if (result.genres) {
        idGenres.forEach((id) => {
          result.genres.forEach((item) => {
            if (item.id === id) arrayGenres.push(item.name);
          });
        });
      }
      return arrayGenres;
    });
}

export function getAllGenresApi() {
  const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;
  return safeFetch(url);
}

export function getGenreMoviesApi(idGenres) {
  const url = `${API_HOST}/discover/movie?api_key=${API_KEY}&with_genres=${idGenres}&language=${LANG}`;
  return safeFetch(url);
}

export function getMovieByIdApi(idMovie) {
  const url = `${API_HOST}/movie/${encodeURIComponent(idMovie)}?api_key=${API_KEY}&language=${LANG}`;
  return safeFetch(url);
}

export function getVideoMovieApi(idMovie) {
  const url = `${API_HOST}/movie/${encodeURIComponent(idMovie)}/videos?api_key=${API_KEY}&language=${LANG}`;
  return safeFetch(url);
}

export function getPopularMoviesApi(page = 1) {
  const url = `${API_HOST}/movie/popular?api_key=${API_KEY}&language=${LANG}&page=${page}`;
  return safeFetch(url);
}

export function searchMoviesApi(search) {
  const url = `${API_HOST}/search/movie?api_key=${API_KEY}&language=${LANG}&query=${encodeURIComponent(search)}`;
  return safeFetch(url);
}
