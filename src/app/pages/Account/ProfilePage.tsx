import { useState } from "react";
import {
  MediaType,
  useMyDetailsQuery,
  useMyMovieWatchlistQuery,
  useMyShowWatchlistQuery,
} from "../../../redux/tmdb";
import { ErrorAlert } from "../../components/ErrorAlert";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Sidescroller } from "../../components/Sidescroller";
import { range } from "../../../utils/utils";
import { LoadingMediaCard, MediaCard } from "../../widgets/MediaCard";

export function ProfilePage() {
  const user = useMyDetailsQuery();
  const [state] = useState({
    movieWatchlistPages: 1,
    showWatchlistPages: 1,
  });

  if (user.isLoading || user.isUninitialized) {
    return <LoadingSpinner />;
  }

  if (user.isError) {
    return <ErrorAlert text="An error ocurred when fetching your user data!" />;
  }

  return (
    <>
      <h1 className="text-3xl my-3 font-black">{user.data.name}</h1>

      <h2 className="text-2xl my-3">Movies Watchlist</h2>
      <Sidescroller>
        <div className="flex space-x-4">
          {range(state.movieWatchlistPages).map((i) => (
            <MediaWatchlistPage key={i} page={i + 1} mediaType="movie" />
          ))}
        </div>
      </Sidescroller>
      <h2 className="text-2xl my-3">Shows Watchlist</h2>
      <Sidescroller>
        <div className="flex space-x-4">
          {range(state.showWatchlistPages).map((i) => (
            <MediaWatchlistPage key={i} page={i + 1} mediaType="show" />
          ))}
        </div>
      </Sidescroller>
    </>
  );
}

function MediaWatchlistPage({
  page,
  mediaType,
}: {
  page: number;
  mediaType: MediaType;
}) {
  const watchlists = {
    movie: useMyMovieWatchlistQuery(
      {
        page,
        sortBy: "created_at.desc",
      },
      {
        skip: mediaType !== "movie",
      }
    ),
    show: useMyShowWatchlistQuery(
      {
        page,
        sortBy: "created_at.desc",
      },
      {
        skip: mediaType !== "show",
      }
    ),
  };

  const watchlist = watchlists[mediaType];

  if (watchlist.isError) {
    return <ErrorAlert text="An error occurred while loading your watchlist" />;
  }

  if (watchlist.isLoading || watchlist.isUninitialized) {
    return (
      <>
        {range(5).map((i) => (
          <Container>
            <LoadingMediaCard key={i} />
          </Container>
        ))}
      </>
    );
  }

  return (
    <>
      {watchlist.data.results.map((media) => (
        <Container>
          <MediaCard type={mediaType} id={media.id} />
        </Container>
      ))}
    </>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div style={{ width: "12rem", minWidth: "12rem" }}>{children}</div>;
}
