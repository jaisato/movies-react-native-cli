import { API_HOST, API_KEY, LANG } from '../utils/constants';

export async function getNewsMoviesApi(page = 1) {
  try {
    const url = `${API_HOST}/movie/now_playing?api_key=${API_KEY}&language=${LANG}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching new movies:', error);
    throw error;
  }
}

export async function getGenreMovieApi(idGenres) {
  try {
    const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const arrayGenres = [];
    idGenres.forEach((id) => {
      result.genres.forEach((item) => {
        if (item.id === id) arrayGenres.push(item.name);
      });
    });
    return arrayGenres;
  } catch (error) {
    console.error('Error fetching genre for movie:', error);
    throw error;
  }
}

export async function getAllGenresApi() {
  try {
    const url = `${API_HOST}/genre/movie/list?api_key=${API_KEY}&language=${LANG}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all genres:', error);
    throw error;
  }
}

export async function getGenreMoviesApi(idGenres) {
  try {
    const url = `${API_HOST}/discover/movie?api_key=${API_KEY}&with_genres=${idGenres}&language=${LANG}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
}

export async function getMovieByIdApi(idMovie) {
  try {
    const url = `${API_HOST}/movie/${idMovie}?api_key=${API_KEY}&language=${LANG}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    throw error;
  }
}

export async function getVideoMovieApi(idMovie) {
  try {
    const url = `${API_HOST}/movie/${idMovie}/videos?api_key=${API_KEY}&language=${LANG}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie video:', error);
    throw error;
  }
}

export async function getPopularMoviesApi(page = 1) {
  try {
    const url = `${API_HOST}/movie/popular?api_key=${API_KEY}&language=${LANG}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

export async function searchMoviesApi(search) {
  try {
    const url = `${API_HOST}/search/movie?api_key=${API_KEY}&language=${LANG}&query=${search}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}
