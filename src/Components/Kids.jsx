import { useMovies } from "../Hooks/hook";
import MovieCarousel from "./MovieCarousel";

export default function Kids() {
  // Use "Animation" which is a common YTS genre for kids' movies
  const { movies, loading, error } = useMovies({ type: "GENRE", genre: "Animation", page: 1 });

  if (loading || !movies) return null;
  if (error) return <p className="text-red-500">{error}</p>;

  return <MovieCarousel title="Kids" movies={movies.slice(0, 20)} />;
}
