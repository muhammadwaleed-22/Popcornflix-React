import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../api/config.api";
import {Button} from "@heroui/react";


export default function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/v2/movie_details.json?movie_id=${id}&with_images=true`,
        );
        if (!res.ok) throw new Error("Failed to fetch movie details");
        const data = await res.json();
        console.log("movie detail response:", data);
        const m = data?.data?.movie;

        if (m) {
          setMovie(m);

          const browseRes = await fetch(`${BASE_URL}/api/v2/list_movies.json`);
          const browseData = await browseRes.json();
          const allMovies = browseData?.data?.movies || [];

          const filtered = allMovies.filter((mv) => mv.id !== Number(id));
          const selected = filtered.slice(0, 4); 
          setSimilarMovies(selected);
        } else {
          setMovie(null);
          setSimilarMovies([]);
        }
      } catch (err) {
        console.error(err);
        setMovie(null);
        setSimilarMovies([]);
      }
    }

    fetchMovie();
  }, [id]);

  if (!movie) return <p className="text-center mt-10 text-white"><Button isLoading variant="light">
              Loading
            </Button></p>;

  return (
    <div className="min-h-screen text-gray-300 p-8 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="border-4 border-white rounded shadow-2xl overflow-hidden mb-4">
            <img
              src={movie.large_cover_image}
              alt={`${movie.title} Poster`}
              className="w-full h-auto block"
            />
          </div>
          <button className="w-full bg-black/85 hover:bg-black/100 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Download
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-black mb-4">{movie.title}</h1>

          <div className="mb-6 leading-relaxed">
            <p className="font-bold text-black">{movie.year}</p>
            <p className="font-bold text-black">{movie.genre}</p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="italic text-sm">Available in:</span>
              {movie.quality?.map((q, idx) => (
                <button
                  key={idx}
                  className={`${
                    q.highlight
                      ? "border-[#6ac045] ring-1 ring-[#6ac045]"
                      : "border-gray-600"
                  } bg-[#2f2f2f] border px-3 py-1 text-xs rounded hover:bg-gray-700`}
                >
                  {q.label}{" "}
                  {q.tag && (
                    <span className="text-[#6ac045] ml-1">{q.tag}</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 italic">
              WEB: same quality as BluRay
            </p>
            <p className="text-xs text-gray-500 italic">
              BluRay estimated release date:{" "}
              <span className="text-[#6ac045] font-semibold">
                {movie.release_date}
              </span>
            </p>
          </div>

          <button className="bg-[#2f2f2f] hover:bg-gray-700 border border-gray-600 px-4 py-1 rounded-sm text-sm flex items-center gap-2 mb-8">
            <span className="text-white">⤓</span> Download Subtitles
          </button>

          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-4">
              <span className="text-green-500 text-xl">♥</span>
              <span className="text-xl font-bold text-gray-500">
                {movie.like_count}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-red-500 text-xl">🍅</span>
              <div>
                <span className="text-xl font-bold text-gray-500">
                  {movie.tomato_rating}%
                </span>
                <span className="text-xs uppercase ml-1 text-gray-500">
                  Tomatometer · {movie.tomato_reviews} reviews
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-yellow-500 text-xl">🍿</span>
              <div>
                <span className="text-xl font-bold text-gray-500">
                  {movie.audience_score}%
                </span>
                <span className="text-xs uppercase ml-1 text-gray-500">
                  Audience · {movie.audience_ratings} ratings
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-yellow-500 text-black px-1 font-bold text-xs rounded-sm">
                IMDb
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-black">
                  {movie.imdb_score}
                </span>
                <span className="text-gray-500 text-sm">/10</span>
                <span className="text-black ml-2">★</span>
                <span className="text-xs text-gray-500">
                  {movie.imdb_votes}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-48">
          <h3 className="text-black font-bold mb-4">Similar Movies</h3>
          <div className="grid grid-cols-2 gap-2">
            {similarMovies.length ? (
              similarMovies.map((sim) => (
                <Link key={sim.id} to={`/detail/${sim.id}`}>
                  <img
                    src={sim.medium_cover_image}
                    className="border-2 border-white rounded hover:scale-105 transition-transform hover:border-black/60"
                    alt={sim.title}
                  />
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500">No similar movies found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 flex flex-wrap gap-2">
        {movie.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="border border-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-900 cursor-pointer transition"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
