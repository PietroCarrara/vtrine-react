import { MovieDetails, imageURL, useMovieDetailsQuery } from "../../redux/tmdb";
import { VscStarEmpty, VscStarFull } from "react-icons/vsc";
import { classes, range } from "../../utils/utils";
import { VscStarHalf } from "react-icons/vsc";
import { ReactElement } from "react";

export function MovieCard({ id }: { id: number }) {
  const movieQuery = useMovieDetailsQuery(id);

  return <ShowMovieCard movie={movieQuery.data ?? {}} />;
}

export function LoadingMovieCard() {
  return <ShowMovieCard movie={{}} />;
}

export function ShowMovieCard({
  movie,
}: {
  movie: Partial<
    Pick<
      MovieDetails,
      "title" | "poster_path" | "vote_average" | "release_date"
    >
  >;
}) {
  const scoreFromZeroToFive =
    movie.vote_average !== undefined ? movie.vote_average / 2 : undefined;

  return (
    <div className="inline-block" style={{ width: "12rem", minWidth: "12rem" }}>
      <div
        className={
          "bg-cover bg-center rounded mb-1" +
          classes({
            "animate-pulse bg-neutral-500": movie.poster_path === undefined,
          })
        }
        style={{
          height: "18rem",
          minHeight: "18rem",
          backgroundImage:
            movie.poster_path !== undefined
              ? `url(${imageURL(movie.poster_path, "w300")})`
              : undefined,
        }}
      />
      <span
        className={`font-bold text-lg line-clamp-1 mb-1 ${classes({
          "rounded animate-pulse text-neutral-500 bg-neutral-500":
            movie.title === undefined,
        })}`}
      >
        {String(movie.title)}
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
              movie.release_date === undefined,
            "text-neutral-400": movie.release_date !== undefined,
          })}`}
        >
          {String(movie.release_date?.year)}
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
