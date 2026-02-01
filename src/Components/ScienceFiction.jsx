import { useMovies } from "../Hooks/hook";
import MovieCarousel from "./MovieCarousel";

export default function ScienceFiction() {
  const { movies, loading, error } = useMovies({ type: "GENRE", genre: "Sci-Fi", page: 1 });

  if (loading || !movies) return null;
  if (error) return <p className="text-red-500">{error}</p>;

  return <MovieCarousel title="Science Fiction" movies={movies.slice(0, 20)} />;
}
