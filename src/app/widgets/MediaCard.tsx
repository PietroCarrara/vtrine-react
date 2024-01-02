import {
  MediaType,
  imageURL,
  useMovieDetailsQuery,
  useShowDetailsQuery,
} from "../../redux/tmdb";
import { slugify } from "../../utils/utils";
import { Link } from "react-router-dom";
import { LoadingText } from "../components/LoadingText";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingRating } from "./LoadingRating";

export function MediaCard({ id, type }: { id: number; type: MediaType }) {
  const movieQuery = useMovieDetailsQuery(id, {
    skip: type !== "movie",
  });
  const showQuery = useShowDetailsQuery(id, {
    skip: type !== "show",
  });

  const query = {
    movie: movieQuery,
    show: showQuery,
  }[type];

  if (query.isError) {
    // TODO: Handle errors
    return <>Something went wrong!</>;
  }

  if (query.isLoading || query.isUninitialized) {
    return <LoadingMediaCard />;
  }

  return (
    <ShowMediaCard
      media={{
        ...query.data,
        state: "loaded",
        type,
      }}
    />
  );
}

export function LoadingMediaCard() {
  return <ShowMediaCard media={{ state: "loading" }} />;
}

export function ShowMediaCard({
  media,
}: {
  media:
    | { state: "loading" }
    | {
        state: "loaded";
        id: number;
        poster_path?: string;
        vote_average: number;
        title: string;
        release?: { year: number };
        type: MediaType;
      };
}) {
  const link =
    media.state === "loaded"
      ? {
          movie: `/movie/${slugify(media.title)}-${media.id}`,
          show: `/show/${slugify(media.title)}-${media.id}`,
        }[media.type]
      : undefined;

  const makeLink =
    link !== undefined
      ? (e: JSX.Element) => <Link to={link}>{e}</Link>
      : (e: JSX.Element) => e;

  return makeLink(
    <div style={{ width: "12rem", minWidth: "12rem" }}>
      <LoadingImage
        loading={media.state === "loading"}
        url={
          media.state === "loaded" && media.poster_path
            ? imageURL(media.poster_path, "w300")
            : undefined
        }
        height="18rem"
        width="100%"
        className="rounded mb-1"
      />

      <LoadingText
        className="font-bold text-lg line-clamp-1 mb-1 w-100"
        loading={media.state === "loading"}
        text={media.state === "loaded" ? media.title : undefined}
      />

      <div>
        <LoadingRating
          loading={media.state === "loading"}
          rating={media.state === "loaded" ? media.vote_average : undefined}
        />
        {(media.state !== "loaded" || media.release?.year !== undefined) && (
          <LoadingText
            className="float-right"
            loadedClassName="mr-2 text-neutral-400"
            loading={media.state === "loading"}
            text={
              media.state === "loaded"
                ? media.release?.year.toString()
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
