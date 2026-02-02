import React, { useState, useMemo, useEffect } from "react";
import Card from "../Components/Card";
import Paggination from "../Components/Paggination";
import { useMovies } from "../Hooks/hook";
import Hero from "../Components/Hero";
import FooterData from "../Components/FooterData";
import { useLocation } from "react-router-dom";
import { useFilteredMovies } from "../Hooks/useFilteredMovies";
import { Button } from "@heroui/react";

export default function Browse({ type = "BROWSE_DATA", title = "Popular Movies" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const queryTerm = params.get("query_term") || "";
  const isSearching = Boolean(queryTerm);

  useEffect(() => {
    setCurrentPage(1);
  }, [queryTerm]);

  const searchParams = useMemo(() => {
    if (!isSearching) return null;
    return {
      query_term: queryTerm,
      page: currentPage,
    };
  }, [isSearching, queryTerm, currentPage]);

  const {
    movies: searchMovies,
    loading: searchLoading,
    error: searchError,
  } = useFilteredMovies(searchParams);

  const {
    movies,
    totalPages,
    loading,
    error,
  } = useMovies({
    type,
    page: currentPage,
    enabled: !isSearching, 
  });

  const displayMovies = isSearching ? searchMovies : movies;
  const displayLoading = isSearching ? searchLoading : loading;
  const displayError = isSearching ? searchError : error;

  if (displayLoading) {
    return (
      <p className="text-center mt-10">
        <Button isLoading variant="light">
          Loading
        </Button>
      </p>
    );
  }

  if (displayError) {
    return (
      <p className="text-center mt-10 text-red-500">
        {displayError}
      </p>
    );
  }

  if (!displayLoading && (!displayMovies || displayMovies.length === 0)) {
    return (
      <p className="text-center mt-10">
        No movies available.
      </p>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
        <h1 className="text-xl sm:text-2xl font-bold flex justify-center text-center">
          {isSearching ? `Search results for "${queryTerm}"` : title}
        </h1>

        <Hero />

        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          {displayMovies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination only for browsing */}
        {!isSearching && (
          <Paggination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <FooterData />
    </>
  );
}
