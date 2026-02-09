import { useState, useEffect } from "react";
import { getMovieList, getMovieDetails, getMovieSuggestion } from "../api/movieService";

export const useMovies = ({
  limit = 20,
  page = 1,
  quality = "",
  minimum_rating = 0,
  query_term = "",
  genre = "",
  sort_by = "date_added",
  order_by = "desc",
  with_rt_ratings = false,
}) => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [limit,
        page,
        quality,
        minimum_rating,
        query_term,
        genre,
        sort_by,
        order_by,
        with_rt_ratings]);

  async function fetchMovies() {
    setLoading(true);
    setError(null);

    try {
      const result = await getMovieList({
        limit,
        page,
        quality,
        minimum_rating,
        query_term,
        genre,
        sort_by,
        order_by,
        with_rt_ratings
    });

      setMovies(result.movies || []);

      const pages = Math.ceil((result.movieCount || 0) / (result.limit || 20));
      setTotalPages(pages || 1);
    } catch (err) {
      setError("Failed to load movies");
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  return { movies, totalPages, loading, error };
};

// Fetching Movies list ended
// Fetching Movies Detail start

export function useMovieDetails(movieId) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMovieDetails({ movieId });

        setMovie(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [movieId]);

  return { movie, loading, error };
}

//Fetching Movies Detail End
//Fetching Suggession Start

export function useMovieSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMovieSuggestion();
        setSuggestions(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { suggestions, loading, error };
}

// Top & New Logic