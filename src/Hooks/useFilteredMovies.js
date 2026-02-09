import { useState, useEffect } from "react";
import { BASE_URL } from "../api/config.api";

export const useFilteredMovies = (searchParams = "") => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchParams || Object.keys(searchParams).length === 0) {
      setMovies([]);
      setLoading(false);
      setError("");
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams(searchParams).toString();
        
        const res = await fetch(`${BASE_URL}/api/v2/list_movies.json?${params}`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();

        setMovies(data?.data?.movies || []);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchParams]);

  return { movies, loading, error };
};
