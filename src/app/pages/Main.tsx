import {
  useTrendingMoviesQuery,
  useTrendingShowsQuery,
} from "../../redux/tmdb";
import { range } from "../../utils/utils";
import { LoadingMediaCard, ShowMediaCard } from "../components/MediaCard";
import { Sidescroller } from "../components/Sidescroller";

export function Main() {
  const trendingMovies = useTrendingMoviesQuery({});
  const trendingShows = useTrendingShowsQuery({});

  if (
    trendingMovies.isUninitialized ||
    trendingMovies.isError ||
    trendingShows.isUninitialized ||
    trendingShows.isError
  ) {
    // TODO: Handle errors
    return <>Something went very bad!</>;
  }

  return (
    <div className="container">
      <h2 className="text-3xl mb-3 font-bold tracking-wider">
        Trending Movies
      </h2>
      <Sidescroller>
        <div className="flex space-x-4">
          {trendingMovies.isFetching &&
            range(5).map((i) => <LoadingMediaCard key={i} />)}
          {!trendingMovies.isLoading &&
            trendingMovies.data.results.map((m) => (
              <ShowMediaCard
                key={m.id}
                media={{
                  ...m,
                  state: "loaded",
                  year: m.release_date.year,
                }}
              />
            ))}
        </div>
      </Sidescroller>

      <h2 className="text-3xl mt-8 mb-3 font-bold tracking-wider">
        Trending Shows
      </h2>
      <Sidescroller>
        <div className="flex space-x-4">
          {trendingShows.isFetching &&
            range(5).map((i) => <LoadingMediaCard key={i} />)}
          {!trendingShows.isLoading &&
            trendingShows.data.results.map((m) => (
              <ShowMediaCard
                key={m.id}
                media={{
                  ...m,
                  state: "loaded",
                  title: m.name,
                  year: m.first_air_date.year,
                }}
              />
            ))}
        </div>
      </Sidescroller>
    </div>
  );
}
