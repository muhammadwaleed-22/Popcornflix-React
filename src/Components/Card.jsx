import { useEffect, useState } from "react";
import { Image, Button } from "@heroui/react";
import { Link } from "react-router-dom";

export default function Card({ movie, onFavoriteChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFav(favs.some((m) => m.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let favs = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favs.some((m) => m.id === movie.id)) {
      // remove
      favs = favs.filter((m) => m.id !== movie.id);
      setIsFav(false);
    } else {
      // add
      favs.push(movie);
      setIsFav(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favs));

    // 🔥 tell parent (Liked page) to update instantly
    if (onFavoriteChange) {
      onFavoriteChange(favs);
    }
  };

  return (
    <div
      className="
        relative 
        w-[150px] h-[220px]
        sm:w-[180px] sm:h-[260px]
        md:w-[210px] md:h-[300px]
        lg:w-[230px] lg:h-[330px]
        rounded-lg overflow-hidden cursor-pointer
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        alt={movie.title}
        className={`object-cover w-full h-full transition-all duration-300 ${
          isHovered ? "blur-sm scale-105" : ""
        }`}
        src={movie.medium_cover_image}
      />

      {isHovered && (
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 z-30 text-xl"
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      )}

      {isHovered && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 text-white p-3 gap-2 transition-opacity duration-300 z-20">
          <p className="text-[10px] sm:text-tiny font-semibold">
            {movie.rating ?? "N/A"}
          </p>

          <p className="text-[10px] sm:text-tiny text-center font-semibold line-clamp-2">
            {movie.genres?.length ? movie.genres.join(", ") : "Genre: N/A"}
          </p>

          <Link to={`/detail/${movie.id}`}>
            <Button size="sm" radius="lg" color="primary">
              View Details
            </Button>
          </Link>
        </div>
      )}

      {!isHovered && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] bg-black/40 text-white rounded-lg py-1 flex justify-center z-10">
          <p className="text-[10px] sm:text-tiny text-white/100 text-center line-clamp-1">
            {movie.title}
          </p>
        </div>
      )}
    </div>
  );
}
