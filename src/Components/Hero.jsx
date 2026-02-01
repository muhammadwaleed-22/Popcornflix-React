import React, { useState } from "react";
import { Form, Input, Button } from "@heroui/react";
import { useFilteredMovies } from "../Hooks/useFilteredMovies";
import Card from "./Card"; 

export default function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams, setSearchParams] = useState(null);

  const { movies, loading, error } = useFilteredMovies(searchParams || {});

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const params = {};
    Object.keys(data).forEach((key) => {
      if (data[key] && data[key] !== "all" && data[key] !== "0") {
        params[key] = data[key];
      }
    });

    if (!params.query) {
      setErrors({ query: "Search term is required" });
      setIsLoading(false);
      return;
    }

    setErrors({});
    setSearchParams(params); 
    setIsLoading(false);
  };

  return (
    <section className="bg-white text-black py-4">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        <Form
          className="mb-6 flex gap-4 flex-col sm:flex-row items-start sm:items-center"
          validationErrors={errors}
          onSubmit={handleSearch}
        >
          <Input
            isRequired
            isDisabled={isLoading}
            label="Search Term"
            labelPlacement="outside"
            name="query"
            placeholder="Search movies..."
            className="flex-1"
          />
          <Button
            color="primary"
            variant="flat"
            isLoading={isLoading}
            type="submit"
            className="mt-6"
          >
            Search
          </Button>
        </Form>

      
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        
          <div>
            <label className="block text-xs mb-1 text-black">Quality:</label>
            <select
              name="quality"
              className="w-full rounded bg-gray-100 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="1080p.x265">1080p.x265</option>
              <option value="2160p">2160p</option>
              <option value="3D">3D</option>
            </select>
          </div>

         
          <div>
            <label className="block text-xs mb-1 text-black">Genre:</label>
            <select
              name="genre"
              className="w-full rounded bg-gray-100 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="action">Action</option>
              <option value="adventure">Adventure</option>
              <option value="animation">Animation</option>
              <option value="biography">Biography</option>
              <option value="comedy">Comedy</option>
              <option value="crime">Crime</option>
              <option value="documentary">Documentary</option>
              <option value="drama">Drama</option>
              <option value="family">Family</option>
              <option value="fantasy">Fantasy</option>
              <option value="film-noir">Film-Noir</option>
              <option value="history">History</option>
              <option value="horror">Horror</option>
              <option value="music">Music</option>
              <option value="musical">Musical</option>
              <option value="mystery">Mystery</option>
              <option value="news">News</option>
              <option value="reality-tv">Reality-TV</option>
              <option value="romance">Romance</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="sport">Sport</option>
              <option value="talk-show">Talk-Show</option>
              <option value="thriller">Thriller</option>
              <option value="war">War</option>
              <option value="western">Western</option>
            </select>
          </div>

          
          <div>
            <label className="block text-xs mb-1 text-black">Rating:</label>
            <select
              name="rating"
              className="w-full rounded bg-gray-100 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="0">All</option>
              <option value="9">9+</option>
              <option value="8">8+</option>
              <option value="7">7+</option>
              <option value="6">6+</option>
              <option value="5">5+</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
              <option value="2">2+</option>
              <option value="1">1+</option>
            </select>
          </div>

          
          <div>
            <label className="block text-xs mb-1 text-black">Year:</label>
            <select
              name="year"
              className="w-full rounded bg-gray-100 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="0">All</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2020-2026">2020-now</option>
              <option value="2010-2026">2010-now</option>
              <option value="2010-2019">2010-2019</option>
              <option value="2000-2009">2000-2009</option>
              <option value="1990-1999">1990-1999</option>
              <option value="1980-1989">1980-1989</option>
              <option value="1970-1979">1970-1979</option>
              <option value="1900-1969">1900-1969</option>
            </select>
          </div>

          
          <div>
            <label className="block text-xs mb-1 text-black">Language:</label>
            <select
              name="language"
              className="w-full rounded bg-gray-100 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en">English</option>
              <option value="foreign">Foreign</option>
              <option value="all" defaultValue>
                All
              </option>
            </select>
          </div>

          {/* Order By */}
          <div>
            <label className="block text-xs mb-1 text-black">Order By:</label>
            <select
              name="order_by"
              className="w-full rounded bg-gray-100 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="featured">Featured</option>
              <option value="seeds">Seeds</option>
              <option value="peers">Peers</option>
              <option value="year">Year</option>
              <option value="rating">IMDb Rating</option>
              <option value="likes">YTS Likes</option>
              <option value="rt_audience">RT Audience</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="downloads">Downloads</option>
            </select>
          </div>
        </div>

        
        <div className="mt-6">
          {loading && <p className="text-center text-black">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && !movies.length && searchParams && (
            <p className="text-center text-gray-500">No movies found.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <Card key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
