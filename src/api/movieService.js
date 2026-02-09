import { BASE_URL } from "./config.api";

const LIST_MOVIES_ENDPOINT = `${BASE_URL}/api/v2/list_movies.json`;
const MOVIE_DETAIL_ENDPOINT = `${BASE_URL}/api/v2/movie_details.json`;
const MOVIES_SUGGESTIONS_ENDPOINT = `${BASE_URL}/api/v2/movie_suggestions.json`;

export const MOVIE_API = {
  BROWSE_DATA: `${LIST_MOVIES_ENDPOINT}`,
  TOP_DATA: `${LIST_MOVIES_ENDPOINT}?sort_by=rating`,
  NEW_DATA: `${LIST_MOVIES_ENDPOINT}?sort_by=date_added&order_by=desc&year=2026`,
  DETAIL_DATA: (movieId) =>
    `${MOVIE_DETAIL_ENDPOINT}?movie_id=${movieId}&with_images=true&with_cast=true`,
};

export async function getMovieDetails({
  movieId,
  with_images = false,
  with_cast = false,
}) {
  try {
    if (!movieId) return null;

    const url = MOVIE_API.DETAIL_DATA(movieId, { with_images, with_cast });
    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch movie details");

    const json = await res.json();
    return json?.data?.movie ?? null;
  } catch (err) {
    console.error("getMovieDetails error:", err);
    return null;
  }
}


export async function getMovieList({
  limit = 20,
  page = 1,
  quality = "",
  minimum_rating = 0,
  query_term = "",
  genre = "",
  sort_by = "date_added",
  order_by = "desc",
  with_rt_ratings = false,
}) {
  try {
    const url = `${LIST_MOVIES_ENDPOINT}?limit=${limit}&page=${page}&quality=${quality}&minimum_rating=${minimum_rating}&query_term=${query_term}&genre=${genre}&sort_by=${sort_by}&order_by=${order_by}&with_rt_ratings=${with_rt_ratings ? 1 : 0}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch movies list");
    const data = await res.json();
    return {
      movies: data?.data?.movies || [],
      movieCount: data?.data?.movie_count || 0,
      limit: data?.data?.limit || limit,
    };
  } catch (err) {
    console.error("getMovieList error:", err);
    return [];
  }
}

export async function getMovieSuggestion() {
  try {
    const res = await fetch(MOVIES_SUGGESTIONS_ENDPOINT);
    if (!res.ok) throw new Error("Failed to fetch movie suggestions");
    const data = await res.json();
    return data?.data?.movies || [];
  } catch (err) {
    console.error("getMovieSuggestion error:", err);
    return [];
  }
}
