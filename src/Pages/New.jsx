import React from "react";
import { useMovies } from "../Hooks/hook";
import Card from "../Components/Card";
import FooterData from "../Components/FooterData";
import { Button } from "@heroui/react";

const New = () => {
  const { movies, loading, error } = useMovies({
    sort_by: "date_added",
    order_by: "desc",
    limit: 100,
    page: 1,
  });

  if (loading)
    return (
      <p className="text-center mt-10">
        <Button isLoading variant="light">
          Loading
        </Button>
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        <h1 className="text-xl sm:text-2xl md:text-2xl font-bold flex justify-center text-center">
          New Movies
        </h1>

        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          {movies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <FooterData />
    </>
  );
};

export default New;
