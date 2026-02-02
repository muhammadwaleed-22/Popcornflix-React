import { useEffect, useState } from "react";
import { MOVIE_API, getSimilarMovies } from "../api/movieService";

// Fetch general movies (browse, top, new)
export const useMovies = ({
  type,
  page = 1,
  params = "",
  genre = "",
  enabled = true, // ✅ NEW
}) => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return; // 🔥 STOP FETCH WHEN DISABLED

    let isMounted = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const genreParam = genre
          ? `genre=${encodeURIComponent(genre)}`
          : "";

        const combinedParams = [params, genreParam]
          .filter(Boolean)
          .join("&");

        let url = "";

        if (type === "BROWSE_DATA") {
          url = `${MOVIE_API[type]}?page=${page}`;
          if (combinedParams) url += `&${combinedParams}`;
        } else if (MOVIE_API[type]) {
          url = MOVIE_API[type];
          if (combinedParams) {
            url += `${url.includes("?") ? "&" : "?"}${combinedParams}`;
          }
        } else {
          url = `${MOVIE_API.BROWSE_DATA}?page=${page}`;
          if (combinedParams) url += `&${combinedParams}`;
        }

        console.debug("[useMovies] Fetching URL:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();

        if (isMounted) {
          setMovies(data?.data?.movies || []);
          setTotalPages(
            type === "BROWSE_DATA"
              ? Math.ceil((data?.data?.movie_count || 1) / 20)
              : 1
          );
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch movies.");
          setMovies([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [type, page, params, genre, enabled]); 

  return { movies, totalPages, loading, error };
};

// Fetch similar movies for a given movie ID
export const useSimilarMovies = ({
  movieId,
  genres = [],
  limit = 4,
}) => {
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    let isMounted = true;

    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const sims = await getSimilarMovies(movieId, genres, limit);
        if (isMounted) setSimilarMovies(sims);
      } catch (err) {
        console.error("Failed to fetch similar movies:", err);
        if (isMounted) setSimilarMovies([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSimilar();

    return () => {
      isMounted = false;
    };
  }, [movieId, genres, limit]);

  return { similarMovies, loading };
};
