import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavbarSearch } from "../Hooks/useNavbarSearch";
import Card from "../Components/Card";
import { Button } from "@heroui/react";
import FooterData from "../Components/FooterData";

export default function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const { query, setQuery, results, loading, error, searchMovies } =
    useNavbarSearch();

  useEffect(() => {
    if (searchQuery && searchQuery !== query) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (query) {
      searchMovies();
    }
  }, [query]);

  return (
    <><div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for "{searchQuery}"
      </h1>

      {loading && (
        <div className="flex justify-center">
          <Button isLoading variant="light">
            Loading
          </Button>
        </div>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-center text-gray-400">
          No movies found.
        </p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {results.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
    <FooterData />
    </>
  );
}
