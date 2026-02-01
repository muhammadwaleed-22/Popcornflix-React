import { useMovies } from "../Hooks/hook";
import MovieCarousel from "./MovieCarousel";

export default function Family() {
  const { movies, loading, error } = useMovies({ type: "GENRE", genre: "Family", page: 1 });

  if (loading || !movies) return null;
  if (error) return <p className="text-red-500">{error}</p>;

  return <MovieCarousel title="Family" movies={movies.slice(0, 20)} />;
}
