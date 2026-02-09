import { useEffect, useState } from "react";
import Card from "../Components/Card";

export default function Liked() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">❤️ Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites yet.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {favorites.map((movie) => (
            <Card
              key={movie.id}
              movie={movie}
              onFavoriteChange={setFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}
