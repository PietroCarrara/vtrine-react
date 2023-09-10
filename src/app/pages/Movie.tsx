import {
  MediaType,
  imageURL,
  useMovieDetailsQuery,
  useMovieImagesQuery,
  useShowDetailsQuery,
  useShowImagesQuery,
} from "../../redux/tmdb";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingParagraph } from "../components/LoadingParagraph";
import { LoadingRating } from "../widgets/LoadingRating";
import { LoadingText } from "../components/LoadingText";
import { MovieTorrents } from "../widgets/MovieTorrents";

export function Movie({ id, mediaType }: { id: number; mediaType: MediaType }) {
  const queries = {
    movie: useMovieDetailsQuery,
    show: useShowDetailsQuery,
  };

  const mediaQuery = queries[mediaType](id);

  if (mediaQuery.isError || mediaQuery.isUninitialized) {
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
            mediaQuery.isSuccess && mediaQuery.data.backdrop_path
              ? `url(${imageURL(mediaQuery.data.backdrop_path, "w1280")})`
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
            loading={mediaQuery.isLoading}
            width={"8rem"}
            height={"12rem"}
            className="rounded"
            url={
              mediaQuery.isSuccess && mediaQuery.data.poster_path
                ? imageURL(mediaQuery.data.poster_path, "w780")
                : undefined
            }
            text={
              mediaQuery.isSuccess && !mediaQuery.data.poster_path
                ? "No Poster"
                : undefined
            }
          />
          <div>
            <LoadingText
              loading={mediaQuery.isLoading}
              text={mediaQuery.data?.title}
              className="block font-bold text-xl mb-1"
            />
            <LoadingText
              loading={mediaQuery.isLoading}
              text={mediaQuery.data?.release.year.toString()}
              className="block text-lg mb-1"
            />
            <LoadingText
              loading={mediaQuery.isLoading}
              text={mediaQuery.data?.genres.map((g) => g.name).join(", ")}
              className="block text-neutral-400 mb-1"
            />
            <LoadingRating
              className="text-xl"
              loading={mediaQuery.isLoading}
              rating={mediaQuery.data?.vote_average}
            />
          </div>
        </div>
        <LoadingText
          className="block italic text-2xl font-black mt-5 mb-3"
          loading={mediaQuery.isLoading}
          text={mediaQuery.data?.tagline}
        />
        <LoadingParagraph
          loading={mediaQuery.isLoading}
          text={mediaQuery.data?.overview}
        />

        <Backdrops id={id} mediaType={mediaType} />

        {mediaQuery.isSuccess && mediaQuery.data.imdb_id && (
          <MovieTorrents tmdbId={id} imdbId={mediaQuery.data.imdb_id} />
        )}
      </div>
    </div>
  );
}

function Backdrops({ id, mediaType }: { id: number; mediaType: MediaType }) {
  const queries = {
    movie: useMovieImagesQuery,
    show: useShowImagesQuery,
  };

  const imagesQuery = queries[mediaType]({ id: id });

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
