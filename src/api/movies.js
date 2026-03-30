import { API_HOST, API_KEY, LANG } from '../utils/constants';

export function getNewsMoviesApi(page = 1) {
  const url = `${API_HOST}/movie/now_playing?api_key=${API_KEY}&language=${LANG}&page=${page}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error fetching new movies:', error);
      throw error;
    });
}

export function getGenreMovieApi(idGenres) {
  const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      const arrayGenres = [];
      idGenres.forEach((id) => {
        result.genres.forEach((item) => {
          if (item.id === id) arrayGenres.push(item.name);
        });
      });
      return arrayGenres;
    })
    .catch((error) => {
      console.error('Error fetching genre for movie:', error);
      throw error;
    });
}

export function getAllGenresApi() {
  const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error fetching all genres:', error);
      throw error;
    });
}

export function getGenreMoviesApi(idGenres) {
  const url = `${API_HOST}/discover/movie?api_key=${API_KEY}&with_genres=${idGenres}&language=${LANG}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error fetching movies by genre:', error);
      throw error;
    });
}

export function getMovieByIdApi(idMovie) {
  const url = `${API_HOST}/movie/${idMovie}?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error fetching movie by ID:', error);
      throw error;
    });
}

export function getVideoMovieApi(idMovie) {
  const url = `${API_HOST}/movie/${idMovie}/videos?api_key=${API_KEY}&language=${LANG}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error fetching movie video:', error);
      throw error;
    });
}

export function getPopularMoviesApi(page = 1) {
  const url = `${API_HOST}/movie/popular?api_key=${API_KEY}&language=${LANG}&page=${page}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error fetching popular movies:', error);
      throw error;
    });
}

export function searchMoviesApi(search) {
  const url = `${API_HOST}/search/movie?api_key=${API_KEY}&language=${LANG}&query=${search}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error searching movies:', error);
      throw error;
    });
}
