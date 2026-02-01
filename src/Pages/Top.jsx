import React from 'react';
import { useMovies } from '../Hooks/hook';
import Card from '../Components/Card';
import FooterData from '../Components/FooterData';
import {Button} from "@heroui/react";

const Top = () => {
  const { movies, loading, error } = useMovies({
    type: 'TOP_DATA',
  });

  if (loading)
    return <p className="text-center mt-10"><Button isLoading variant="light">
                Loading
              </Button></p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );

  return (
    <>
    <div className="p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold flex justify-center">
        Top Movies
      </h1>

      <div className="flex flex-wrap gap-4 justify-center">
        {movies.map(movie => (
          <Card key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
    <FooterData />
    </>
  );
};

export default Top;
