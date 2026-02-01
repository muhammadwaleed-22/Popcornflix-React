import { useMovies } from "../Hooks/hook";
import MovieCarousel from "./MovieCarousel";

export default function NewRelease() {
  const { movies, loading, error } = useMovies({ type: "NEW_RELEASE", page: 1 });

  if (loading || !movies) return null;
  if (error) return <p className="text-red-500">{error}</p>;

  return <MovieCarousel title="New Release" movies={movies.slice(0, 20)} />;
}
