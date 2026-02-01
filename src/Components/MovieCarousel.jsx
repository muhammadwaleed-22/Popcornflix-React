import { useState } from "react";
import Card from "./Card";

export default function MovieCarousel({ title, movies, itemsPerPage = 5 }) {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsPerPage, movies.length - itemsPerPage)
    );
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const visibleMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  if (!movies || movies.length === 0)
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-gray-400">No movies available for this category.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl mx-12 font-bold text-black">{title}</h2>

      <div className="relative flex items-center justify-center gap-2">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="bg-black/50 text-white p-2 rounded disabled:opacity-30"
        >
          {'<'}
        </button>

        
        <div className="flex gap-4 overflow-hidden">
          {visibleMovies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>

        
        <button
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= movies.length}
          className="bg-black/50 text-white p-2 rounded disabled:opacity-30"
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}
