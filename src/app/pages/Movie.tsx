import { imageURL, useMovieDetailsQuery } from "../../redux/tmdb";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingParagraph } from "../components/LoadingParagraph";
import { LoadingRating } from "../widgets/LoadingRating";
import { LoadingText } from "../components/LoadingText";
import { MovieDownloads } from "../widgets/MovieDownloads";

export function Movie({ id }: { id: number }) {
  const movieQuery = useMovieDetailsQuery(id);

  if (movieQuery.isError || movieQuery.isUninitialized) {
    // TODO: Handle errors
    return <>This is very bad!</>;
  }

  return (
    <div>
      <div
        className="bg-cover bg-top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          height: "12rem",
          width: "100vw",
          backgroundImage:
            movieQuery.isSuccess && movieQuery.data.backdrop_path
              ? `url(${imageURL(movieQuery.data.backdrop_path, "w1280")})`
              : undefined,
        }}
      >
        <div
          className="bg-gradient-to-t from-neutral-900"
          style={{
            height: "10rem",
          }}
        />
        <div
          className="bg-neutral-900"
          style={{
            height: "2rem",
          }}
        />
      </div>

      <div className="flex space-x-3 mb-4" style={{ marginTop: "6rem" }}>
        <LoadingImage
          loading={movieQuery.isLoading}
          width={"8rem"}
          height={"12rem"}
          className="rounded"
          url={
            movieQuery.isSuccess && movieQuery.data.poster_path
              ? imageURL(movieQuery.data.poster_path, "w780")
              : undefined
          }
          text={
            movieQuery.isSuccess && !movieQuery.data.poster_path
              ? "No Poster"
              : undefined
          }
        />
        <div>
          <LoadingText
            loading={movieQuery.isLoading}
            text={movieQuery.isSuccess ? movieQuery.data.title : undefined}
            className="block font-bold text-xl mb-1"
          />
          <LoadingText
            loading={movieQuery.isLoading}
            text={movieQuery.data?.release_date.year.toString()}
            className="block text-lg mb-1"
          />
          <LoadingText
            loading={movieQuery.isLoading}
            text={movieQuery.data?.genres.map((g) => g.name).join(", ")}
            className="block text-neutral-400 mb-1"
          />
          <LoadingRating
            className="text-xl"
            loading={movieQuery.isLoading}
            rating={movieQuery.data?.vote_average}
          />
        </div>
      </div>
      <LoadingText
        className="block italic text-2xl font-black mt-5 mb-3"
        loading={movieQuery.isLoading}
        text={movieQuery.data?.tagline}
      />
      <LoadingParagraph
        loading={movieQuery.isLoading}
        text={movieQuery.data?.overview}
      />

      {movieQuery.isSuccess && movieQuery.data.imdb_id && (
        <MovieDownloads imdbId={movieQuery.data.imdb_id} />
      )}
    </div>
  );
}
