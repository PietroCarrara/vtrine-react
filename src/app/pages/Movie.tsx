import {
  imageURL,
  useMovieDetailsQuery,
  useMovieImagesQuery,
} from "../../redux/tmdb";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingParagraph } from "../components/LoadingParagraph";
import { LoadingRating } from "../widgets/LoadingRating";
import { LoadingText } from "../components/LoadingText";
import { MovieTorrents } from "../widgets/MovieTorrents";

export function Movie({ id }: { id: number }) {
  const movieQuery = useMovieDetailsQuery(id);

  if (movieQuery.isError || movieQuery.isUninitialized) {
    // TODO: Handle errors
    return <>This is very bad!</>;
  }

  return (
    <div>
      <div
        className="bg-cover bg-top absolute top-0 left-0 -z-20"
        style={{
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

      <div className="px-3">
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
              text={movieQuery.data?.title}
              className="block font-bold text-xl mb-1"
            />
            <LoadingText
              loading={movieQuery.isLoading}
              text={movieQuery.data?.release.year.toString()}
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

        <Backdrops id={id} />

        {movieQuery.isSuccess && movieQuery.data.imdb_id && (
          <MovieTorrents
            imdbId={movieQuery.data.imdb_id}
            title={`${movieQuery.data.title} (${movieQuery.data.release.year})`}
          />
        )}
      </div>
    </div>
  );
}

function Backdrops({ id }: { id: number }) {
  const imagesQuery = useMovieImagesQuery({ id: id });

  if (imagesQuery.isError || imagesQuery.isUninitialized) {
    // TODO: Handle errors
    return <>This is very bad!</>;
  }

  // Sort backdrops by language-neutral first, and then by score
  const images = imagesQuery.isLoading
    ? [undefined, undefined, undefined]
    : imagesQuery.data.backdrops
        .slice()
        .sort((a, b) => {
          if (
            a.iso_639_1 === b.iso_639_1 ||
            (a.iso_639_1 !== "xx" && b.iso_639_1 !== "xx")
          ) {
            return b.vote_average - a.vote_average;
          }

          return a.iso_639_1 === "xx" ? -1 : 1;
        })
        // Skip the first image if there's more than 3
        // (it's probably the background shown behind the poster)
        .slice(0, 4)
        .reverse()
        .slice(0, 3)
        .reverse();

  const sizes = {
    big: {
      width: "100%",
      height: "100%",
    },
    small: {
      width: "100%",
      height: "5rem",
    },
  };

  return (
    <div className="py-2 grid grid-rows-2 grid-flow-col gap-1">
      {images.map((image, i) => {
        const size = i === 0 ? "big" : "small";

        return (
          <LoadingImage
            className={
              size === "big" ? "row-span-2 col-span-2 rounded-sm" : "rounded-sm"
            }
            width={sizes[size].width}
            height={sizes[size].height}
            loading={image === undefined}
            url={image && imageURL(image.file_path, "w780")}
          />
        );
      })}
    </div>
  );
}
