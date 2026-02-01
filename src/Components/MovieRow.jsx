import Card from "./Card";
import { useMovies } from "../Hooks/hook";

export default function MovieRow({ title, type, genre }) {
  // If a genre is supplied, pass a params string to the hook to filter by genre
  const params = genre ? `genre=${encodeURIComponent(genre)}` : '';

  // Normalize special type names
  const normalizedType =
    type === 'NEW_RELEASE' ? 'NEW_DATA' : type === 'TOP' ? 'TOP_DATA' : type;

  const { movies, loading, error } = useMovies({
    type: normalizedType,
    page: 1,
    params,
  });

  if (loading)
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-white px-2">{title}</h2>
        <p className="text-sm text-gray-400 px-2">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-white px-2">{title}</h2>
        <p className="text-sm text-red-500 px-2">Failed to load movies</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-white px-2">{title}</h2>

      <div className="flex gap-4 overflow-x-auto px-2">
        {movies.slice(0, 10).map((movie) => (
          <Card key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
