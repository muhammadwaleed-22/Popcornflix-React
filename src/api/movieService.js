import { BASE_URL } from './config.api';

const MOVIES_ENDPOINT = `${BASE_URL}/api/v2/list_movies.json`;

export const MOVIE_API = {
  BROWSE_DATA: `${MOVIES_ENDPOINT}`,
  TOP_DATA: `${MOVIES_ENDPOINT}?sort_by=rating&order_by=desc&limit=100`,
  NEW_DATA: `${MOVIES_ENDPOINT}?sort_by=date_added&order_by=desc`,
};

/**
 * Fetch similar movies by finding movies that share at least one genre
 * Falls back to returning the first available movies (excluding the current movie)
 */
export async function getSimilarMovies(movieId, genres = [], limit = 4) {
  try {
    const res = await fetch(`${MOVIES_ENDPOINT}`);
    if (!res.ok) throw new Error('Failed to fetch movies for similar');
    const data = await res.json();
    const all = data?.data?.movies || [];

    
    const candidates = all.filter((m) => m.id !== Number(movieId));

    if (!genres || genres.length === 0) {
      return candidates.slice(0, limit);
    }

    
    const matched = candidates.filter((m) => {
      if (!m.genres || m.genres.length === 0) return false;
      return m.genres.some((g) => genres.includes(g));
    });

    
    const result = matched.slice(0, limit);
    if (result.length >= limit) return result;

    const remaining = candidates.filter((m) => !result.includes(m)).slice(0, limit - result.length);
    return result.concat(remaining);
  } catch (err) {
    console.error('getSimilarMovies error:', err);
    return [];
  }
}

