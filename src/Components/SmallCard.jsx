const SmallCard = ({ movie, clearQuery }) => {
  return (
    <Link
      to={`/detail/${movie.id}`}
      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
      onClick={clearQuery}
    >
      <img
        src={movie.medium_cover_image}
        alt={movie.title}
        className="w-12 h-16 object-cover rounded"
      />
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-sm">{movie.title}</span>
        <span className="text-xs text-gray-500">{movie.year}</span>
      </div>
    </Link>
  );
};
