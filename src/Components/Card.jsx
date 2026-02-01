import { useState } from "react";
import { Image, Button } from "@heroui/react";
import { Link } from "react-router-dom";

export default function Card({ movie }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-[230px] h-[330px] rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        alt={movie.title}
        className={`object-cover w-full h-full transition-all duration-300 ${
          isHovered ? "blur-sm scale-105" : ""
        }`}
        height={330}
        width={230}
        src={movie.medium_cover_image}
      />

      {isHovered && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 text-white p-4 gap-2 transition-opacity duration-300 z-20">
          <p className="text-tiny font-semibold">{movie.rating ?? 'N/A'}</p>
          <p className="text-tiny font-semibold">{movie.genres?.length ? movie.genres.join(', ') : 'Genre: N/A'}</p>
          <Link to={`/detail/${movie.id}`}>
            <Button size="sm" radius="lg" color="primary">
              View Details
            </Button>
          </Link>
        </div>
      )}

      {!isHovered && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] bg-black/40 text-white rounded-lg py-1 flex justify-center z-10">
          <p className="text-tiny text-white/100">{movie.title}</p>
        </div>
      )}
    </div>
  );
}
