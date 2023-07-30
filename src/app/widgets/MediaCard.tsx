import { MediaType, imageURL, useMovieDetailsQuery } from "../../redux/tmdb";
import { VscStarEmpty, VscStarFull } from "react-icons/vsc";
import { range, slugify } from "../../utils/utils";
import { VscStarHalf } from "react-icons/vsc";
import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { LoadingText } from "../components/LoadingText";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingElement } from "../components/LoadingElement";

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
        className="font-bold text-lg line-clamp-1 mb-1"
        loading={media.state === "loading"}
        text={media.state === "loaded" ? media.title : undefined}
      />

      <div>
        <LoadingElement
          loading={media.state === "loading"}
          className="inline-block"
          loadedClassName="text-yellow-500"
        >
          {scoreFromZeroToFive !== undefined && (
            <>
              {range(Math.floor(scoreFromZeroToFive)).map((i) => (
                <Star state="full" key={i} />
              ))}
              {scoreFromZeroToFive - Math.floor(scoreFromZeroToFive) >=
                0.45 && (
                <>
                  <Star state="half" />
                  {range(Math.ceil(4 - scoreFromZeroToFive)).map((i) => (
                    <Star state="empty" key={i} />
                  ))}
                </>
              )}
              {!(
                scoreFromZeroToFive - Math.floor(scoreFromZeroToFive) >=
                0.45
              ) &&
                range(Math.ceil(5 - scoreFromZeroToFive)).map((i) => (
                  <Star state="empty" key={i} />
                ))}
            </>
          )}
          {scoreFromZeroToFive === undefined &&
            range(5).map((i) => <Star key={i} state="empty" />)}
        </LoadingElement>

        <LoadingText
          className="float-right"
          loadedClassName="mr-2 text-neutral-400"
          loading={media.state === "loading"}
          text={media.state === "loaded" ? media.year.toString() : undefined}
        />
      </div>
    </div>
  );
}

function Star({ state }: { state: "full" | "half" | "empty" }) {
  const result: Record<typeof state, ReactElement> = {
    full: <VscStarFull style={{ display: "inline" }} />,
    half: <VscStarHalf style={{ display: "inline" }} />,
    empty: <VscStarEmpty style={{ display: "inline" }} />,
  };

  return result[state];
}
