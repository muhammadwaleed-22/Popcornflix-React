import { useMovies } from "../Hooks/hook";
import MovieCarousel from "./MovieCarousel";

export default function Romantic() {
  const { movies, loading, error } = useMovies({ type: "GENRE", genre: "Romance", page: 1 });

  if (loading || !movies) return null;
  if (error) return <p className="text-red-500">{error}</p>;

  return <MovieCarousel title="Romantic" movies={movies.slice(0, 20)} />;
}
