import {
  useTrendingMoviesQuery,
  useTrendingShowsQuery,
} from "../../redux/tmdb";
import { range } from "../../utils/utils";
import { LoadingMediaCard, ShowMediaCard } from "../widgets/MediaCard";
import { Sidescroller } from "../components/Sidescroller";

export function Explore() {
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
    <div>
      <h2 className="text-3xl my-3 mx-6 font-black">Trending Movies</h2>
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
                  type: "movie",
                }}
              />
            ))}
        </div>
      </Sidescroller>

      <h2 className="text-3xl my-3 mx-6 font-black">Trending Shows</h2>
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
                  type: "show",
                }}
              />
            ))}
        </div>
      </Sidescroller>
    </div>
  );
}
