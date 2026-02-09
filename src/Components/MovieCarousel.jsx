import { useEffect, useState } from "react";
import Card from "./Card";

export default function MovieCarousel({ title, movies }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  // Responsive items per slide
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) setItemsPerSlide(2);
      else if (width < 1024) setItemsPerSlide(3);
      else setItemsPerSlide(5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build slides (chunk movies into groups)
  let slides = [];
  if (movies && movies.length > 0) {
    for (let i = 0; i < movies.length; i += itemsPerSlide) {
      slides.push(movies.slice(i, i + itemsPerSlide));
    }
  }

  // Reset slide if movies/itemsPerSlide changes
  useEffect(() => {
    setActiveSlide(0);
  }, [movies, itemsPerSlide]);

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="text-sm text-gray-400">
          No movies available for this category.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl mx-4 sm:mx-12 font-bold text-black">{title}</h2>

      <div className="relative w-full">
        {/* Carousel wrapper */}
        <div className="relative overflow-hidden rounded-xl">
          {slides.map((slideMovies, index) => (
            <div
              key={index}
              className={`duration-200 ease-linear ${
                index === activeSlide ? "block" : "hidden"
              }`}
            >
              <div className="flex justify-center gap-4 px-4 sm:px-12 py-2">
                {slideMovies.map((movie) => (
                  <Card key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Prev button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeSlide === 0}
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none disabled:opacity-30"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-4 group-focus:ring-white">
            <svg
              className="w-5 h-5 text-white rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m15 19-7-7 7-7"
              />
            </svg>
          </span>
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={activeSlide === slides.length - 1}
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none disabled:opacity-30"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-4 group-focus:ring-white">
            <svg
              className="w-5 h-5 text-white rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m9 5 7 7-7 7"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
