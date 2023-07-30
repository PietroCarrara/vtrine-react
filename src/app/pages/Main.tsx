import { useTrendingMoviesQuery } from "../../redux/tmdb";
import { range } from "../../utils/utils";
import {
  LoadingMovieCard,
  MovieCard,
  ShowMovieCard,
} from "../components/MovieCard";

export function Main() {
  const trendingMovies = useTrendingMoviesQuery({});

  if (trendingMovies.isUninitialized || trendingMovies.isError) {
    // TODO: Handle errors
    return <>Something went very bad!</>;
  }

  return (
    <div className="container">
      <h2 className="text-3xl mb-3 font-bold tracking-wider">
        Trending Movies
      </h2>
      <div className="flex space-x-4">
        {trendingMovies.isFetching &&
          range(5).map((i) => <LoadingMovieCard key={i} />)}
        {!trendingMovies.isLoading &&
          trendingMovies.data.results.map((m) => <ShowMovieCard movie={m} />)}
      </div>
    </div>
    // <div className="flex space-x-4">
    //   <MovieCard id={420648} />
    //   <MovieCard id={4588} />
    //   <MovieCard id={705996} />
    // </div>
  );
}
