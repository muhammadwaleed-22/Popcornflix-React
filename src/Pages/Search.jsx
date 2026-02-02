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
    <>
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
          Search results for "{searchQuery}"
        </h1>

        {loading && (
          <div className="flex justify-center my-6">
            <Button isLoading variant="light">
              Loading
            </Button>
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 my-6">{error}</p>
        )}

        {!loading && !error && results.length === 0 && (
          <p className="text-center text-gray-400 my-6">
            No movies found.
          </p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
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
