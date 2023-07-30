import { MediaType, imageURL, useMovieDetailsQuery } from "../../redux/tmdb";
import { VscStarEmpty, VscStarFull } from "react-icons/vsc";
import { classes, range, slugify } from "../../utils/utils";
import { VscStarHalf } from "react-icons/vsc";
import { ReactElement } from "react";
import { Link } from "react-router-dom";

export function MediaCard({ id, type }: { id: number; type: MediaType }) {
  const movieQuery = useMovieDetailsQuery(id);

  if (movieQuery.isError) {
    // TODO: Handle errors
    return <>Something went wrong!</>;
  }

  if (movieQuery.isLoading || movieQuery.isUninitialized) {
    return <LoadingMediaCard />;
  }

  return (
    <ShowMediaCard
      media={{
        ...movieQuery.data,
        state: "loaded",
        year: movieQuery.data.release_date.year,
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
        year: number;
        type: MediaType;
      };
}) {
  const scoreFromZeroToFive =
    media.state !== "loading" ? media.vote_average / 2 : undefined;

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
      <div
        className={
          "bg-cover bg-center rounded mb-1" +
          classes({
            "animate-pulse bg-neutral-500": media.state === "loading",
          })
        }
        style={{
          height: "18rem",
          minHeight: "18rem",
          backgroundImage:
            media.state === "loaded" && media.poster_path
              ? `url(${imageURL(media.poster_path, "w300")})`
              : undefined,
        }}
      />
      <span
        className={`font-bold text-lg line-clamp-1 mb-1 ${classes({
          "rounded animate-pulse text-neutral-500 bg-neutral-500":
            media.state === "loading",
        })}`}
      >
        {media.state === "loaded" && media.title}
      </span>

      <div>
        {scoreFromZeroToFive !== undefined && (
          <>
            {range(Math.floor(scoreFromZeroToFive)).map((i) => (
              <Star style="full" key={i} />
            ))}
            {scoreFromZeroToFive - Math.floor(scoreFromZeroToFive) >= 0.45 && (
              <>
                <Star style="half" />
                {range(Math.ceil(4 - scoreFromZeroToFive)).map((i) => (
                  <Star style="empty" key={i} />
                ))}
              </>
            )}
            {!(scoreFromZeroToFive - Math.floor(scoreFromZeroToFive) >= 0.45) &&
              range(Math.ceil(5 - scoreFromZeroToFive)).map((i) => (
                <Star style="empty" key={i} />
              ))}
          </>
        )}
        {scoreFromZeroToFive === undefined &&
          range(5).map((i) => <Star key={i} style="empty" loading />)}

        <span
          className={`float-right mr-2 ${classes({
            "rounded animate-pulse text-neutral-500 mr-0 bg-neutral-500":
              media.state === "loading",
            "text-neutral-400": media.state === "loaded",
          })}`}
        >
          {media.state === "loaded" && media.year}
        </span>
      </div>
    </div>
  );
}

function Star({
  style,
  loading = false,
}: {
  style: "full" | "half" | "empty";
  loading?: boolean;
}) {
  const className = loading
    ? "text-neutral-500 animate-pulse"
    : "text-yellow-500";

  const result: Record<typeof style, ReactElement> = {
    full: <VscStarFull className={className} style={{ display: "inline" }} />,
    half: <VscStarHalf className={className} style={{ display: "inline" }} />,
    empty: <VscStarEmpty className={className} style={{ display: "inline" }} />,
  };

  return result[style];
}
