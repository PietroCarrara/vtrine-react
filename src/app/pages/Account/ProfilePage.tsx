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
  const [state, setState] = useState({
    movieWatchlistPages: 1,
    showWatchlistPages: 1,
  });
  const movieWatchlist = useMyMovieWatchlistQuery({
    page: 1,
    sortBy: "created_at.desc",
  });
  const showWatchlist = useMyShowWatchlistQuery({
    page: 1,
    sortBy: "created_at.desc",
  });

  if (
    user.isLoading ||
    user.isUninitialized ||
    movieWatchlist.isLoading ||
    movieWatchlist.isUninitialized ||
    showWatchlist.isLoading ||
    showWatchlist.isUninitialized
  ) {
    return <LoadingSpinner />;
  }

  if (user.isError || movieWatchlist.isError || showWatchlist.isError) {
    return <ErrorAlert text="An error ocurred when fetching your user data!" />;
  }

  return (
    <>
      <h1 className="text-3xl my-3 font-black">{user.data.name}</h1>

      <h2 className="text-2xl my-3">Movies Watchlist</h2>
      <Sidescroller
        onScrollEnd={(scroll) => {
          if (
            scroll > 0.95 &&
            state.movieWatchlistPages < movieWatchlist.data.total_pages
          ) {
            setState({
              ...state,
              movieWatchlistPages: state.movieWatchlistPages + 1,
            });
          }
        }}
      >
        <div className="flex space-x-4">
          {range(state.movieWatchlistPages).map((i) => (
            <MediaWatchlistPage key={i} page={i + 1} mediaType="movie" />
          ))}
          {state.movieWatchlistPages < movieWatchlist.data.total_pages && (
            <Container>
              <LoadingMediaCard />
            </Container>
          )}
        </div>
      </Sidescroller>
      <h2 className="text-2xl my-3">Shows Watchlist</h2>
      <Sidescroller
        onScrollEnd={(scroll) => {
          if (
            scroll > 0.95 &&
            state.showWatchlistPages < showWatchlist.data.total_pages
          ) {
            setState({
              ...state,
              showWatchlistPages: state.showWatchlistPages + 1,
            });
          }
        }}
      >
        <div className="flex space-x-4">
          {range(state.showWatchlistPages).map((i) => (
            <MediaWatchlistPage key={i} page={i + 1} mediaType="show" />
          ))}
          {state.showWatchlistPages < showWatchlist.data.total_pages && (
            <Container>
              <LoadingMediaCard />
            </Container>
          )}
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
          <Container key={i}>
            <LoadingMediaCard />
          </Container>
        ))}
      </>
    );
  }

  return (
    <>
      {watchlist.data.results.map((media) => (
        <Container key={media.id}>
          <MediaCard type={mediaType} id={media.id} />
        </Container>
      ))}
    </>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div style={{ width: "12rem", minWidth: "12rem" }}>{children}</div>;
}
