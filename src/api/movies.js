import { API_HOST, API_KEY, LANG } from '../utils/constants';

/**
 * fetch() only rejects on a network failure, so an expired key (401) or a
 * throttled request (429) used to sail through as a perfectly valid JSON error
 * body. Callers then read result.genres / result.results off it and died with
 * an unrelated TypeError, far from the actual cause.
 */
function checkResponse(response) {
  if (!response.ok) {
    return Promise.reject(
      new Error(`TMDb request failed: ${response.status} ${response.statusText}`),
    );
  }

  return response.json();
}

export function getNewsMoviesApi(page = 1) {
  const url = `${API_HOST}/movie/now_playing?api_key=${API_KEY}&language=${LANG}&page=${page}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      return result;
    });
}

export function getGenreMovieApi(idGenres) {
  const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      const arrayGenres = [];
      idGenres.forEach((id) => {
        result.genres.forEach((item) => {
          if (item.id === id) arrayGenres.push(item.name);
        });
      });
      return arrayGenres;
    });
}

export function getAllGenresApi() {
  const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      return result;
    });
}

export function getGenreMoviesApi(idGenres) {
  const url = `${API_HOST}/discover/movie?api_key=${API_KEY}&with_genres=${encodeURIComponent(
    idGenres,
  )}&language=${LANG}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      return result;
    });
}

export function getMovieByIdApi(idMovie) {
  const url = `${API_HOST}/movie/${idMovie}?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      return result;
    });
}

export function getVideoMovieApi(idMovie) {
  const url = `${API_HOST}/movie/${idMovie}/videos?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      return result;
    });
}

export function getPopularMoviesApi(page = 1) {
  const url = `${API_HOST}/movie/popular?api_key=${API_KEY}&language=${LANG}&page=${page}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      return result;
    });
}

export function searchMoviesApi(search) {
  // The term is typed by the user and goes into a query-string value, so it has
  // to be percent-encoded. Interpolated raw, "Fast & Furious" cut the URL at
  // the ampersand - TMDb saw query=Fast and an extra Furious= parameter - and
  // a '#' truncated it entirely.
  const url = `${API_HOST}/search/movie?api_key=${API_KEY}&language=${LANG}&query=${encodeURIComponent(
    search,
  )}`;

  return fetch(url)
    .then(checkResponse)
    .then((result) => {
      return result;
    });
}
