import React, { useState, useEffect } from "react";
import Card from "../Components/Card";
import Paggination from "../Components/Paggination";
import { useMovies } from "../Hooks/hook";
import FooterData from "../Components/FooterData";
import CustomSelect from "../Components/CustomSelect";
import { Button } from "@heroui/react";

export default function Browse({
  type: initialType = "BROWSE_DATA",
  title: initialTitle = "Popular Movies",
}) {
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState(initialTitle);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    quality: "all",
    genre: "all",
    rating: "all",
    year: "all",
    language: "all",
    orderBy: "latest",
  });

  const [displayMovies, setDisplayMovies] = useState([]);

  // Update filters (both search and other filters)
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // reset to first page
  };

  const searchTerm = filters.search.trim() || undefined;

  const { movies, totalPages, loading, error } = useMovies({
    type,
    page: currentPage,
    query_term: searchTerm,
    quality: filters.quality !== "all" ? filters.quality : undefined,
    genre: filters.genre !== "all" ? filters.genre : undefined,
    minimum_rating: filters.rating !== "all" ? parseInt(filters.rating) : 0,
    sort_by: "date_added",
    order_by: filters.orderBy,
    year: filters.year !== "all" ? filters.year : undefined,
    language: filters.language !== "all" ? filters.language : undefined,
  });

  useEffect(() => {
    if (!loading && movies) setDisplayMovies(movies);
  }, [movies, loading]);

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
        <h1 className="text-xl sm:text-2xl font-bold flex justify-center text-center">
          {searchTerm ? `Search results for "${searchTerm}"` : title}
        </h1>

        <CustomSelect
          selected={filters}
          onChange={handleFilterChange}
        />

        <Paggination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center min-h-[300px]">
          {displayMovies?.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}

          {loading && (
            <div className="w-full flex justify-center mt-6">
              <Button isLoading color="light">
                Loading
              </Button>
            </div>
          )}

          {!loading && error && (
            <p className="text-center mt-10 text-red-500">{error}</p>
          )}

          {!loading && !error && displayMovies?.length === 0 && (
            <p className="text-center mt-10">No movies available.</p>
          )}
        </div>

        <Paggination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <FooterData />
    </>
  );
}
