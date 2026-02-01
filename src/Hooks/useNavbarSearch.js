import { useState } from "react";

export const useNavbarSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://yts.bz/api/v2/list_movies.json?query_term=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data?.data?.movies || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    searchMovies,
  };
};
