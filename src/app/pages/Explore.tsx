import {
  useTrendingMoviesQuery,
  useTrendingShowsQuery,
} from "../../redux/tmdb";
import { range } from "../../utils/utils";
import { LoadingMediaCard, DisplayMediaCard } from "../widgets/MediaCard";
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
      <h2 className="text-3xl my-3 mx-3 font-black">Trending Movies</h2>
      <Sidescroller>
        <div className="flex space-x-4">
          {trendingMovies.isFetching &&
            range(5).map((i) => (
              <Container key={i}>
                <LoadingMediaCard />
              </Container>
            ))}
          {!trendingMovies.isLoading &&
            trendingMovies.data.results.map((m) => (
              <Container key={m.id}>
                <DisplayMediaCard
                  media={{
                    ...m,
                    state: "loaded",
                    type: "movie",
                  }}
                />
              </Container>
            ))}
        </div>
      </Sidescroller>

      <h2 className="text-3xl my-3 mx-3 font-black">Trending Shows</h2>
      <Sidescroller>
        <div className="flex space-x-4">
          {trendingShows.isFetching &&
            range(5).map((i) => (
              <Container key={i}>
                <LoadingMediaCard />
              </Container>
            ))}
          {!trendingShows.isLoading &&
            trendingShows.data.results.map((m) => (
              <Container key={m.id}>
                <DisplayMediaCard
                  media={{
                    ...m,
                    state: "loaded",
                    type: "show",
                  }}
                />
              </Container>
            ))}
        </div>
      </Sidescroller>
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div style={{ width: "12rem", minWidth: "12rem" }}>{children}</div>;
}
