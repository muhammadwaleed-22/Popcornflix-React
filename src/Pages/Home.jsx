import React from "react";
import NewRelease from "../Components/NewRelease";
import ScienceFiction from "../Components/ScienceFiction";
import Kids from "../Components/Kids";
import Family from "../Components/Family";
import Dramas from "../Components/Dramas";
import Romantic from "../Components/Romantic";
import FooterData from "../Components/FooterData";
import { useLocation } from "react-router-dom";
import { useFilteredMovies } from "../Hooks/useFilteredMovies";
import Card from "../Components/Card";
import {Button} from "@heroui/react";

export default function Home() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryTerm = params.get("query_term") || "";
  const isSearching = Boolean(queryTerm);
  console.log("Home: location.search", location.search, "queryTerm", queryTerm);

  const { movies: searchMovies, loading, error } = useFilteredMovies(
    isSearching ? { query_term: queryTerm } : null
  );

  if (isSearching) {
    if (loading) return <p className="text-center mt-10"><Button isLoading variant="light">
                Loading
              </Button></p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!searchMovies || searchMovies.length === 0)
      return <p className="text-center mt-10">No movies found.</p>;

    return (
      <>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Search results</h1>

          <div className="flex flex-wrap gap-4 justify-center">
            {searchMovies.map((movie) => (
              <Card key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
        <FooterData />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-10 p-4">
        <NewRelease />
        <ScienceFiction />
        <Romantic />
        <Kids />
        <Family />
        <Dramas />
      </div>
      <FooterData />
    </>
  );
}
