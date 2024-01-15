import {
  MediaType,
  imageURL,
  useMovieDetailsQuery,
  useMovieImagesQuery,
  useShowDetailsQuery,
  useShowImagesQuery,
  useVideosQuery,
} from "../../redux/tmdb";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingParagraph } from "../components/LoadingParagraph";
import { LoadingRating } from "../widgets/LoadingRating";
import { LoadingText } from "../components/LoadingText";
import { MovieTorrents } from "../widgets/MovieTorrents";
import { VscPlayCircle } from "react-icons/vsc";

export function Media({ id, mediaType }: { id: number; mediaType: MediaType }) {
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
        <div
          className="grid grid-cols-2 gap-4 mb-4"
          style={{ marginTop: "6rem" }}
        >
          <div style={{ aspectRatio: "12 / 18", width: "100%" }}>
            <LoadingImage
              loading={mediaQuery.isLoading}
              className="rounded shadow-md"
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
          </div>
          <div>
            <LoadingText
              loading={mediaQuery.isLoading}
              text={mediaQuery.data?.title}
              className="block font-bold text-xl mb-1"
            />
            <LoadingText
              loading={mediaQuery.isLoading}
              text={mediaQuery.data?.release?.year.toString()}
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
            <Trailers id={id} mediaType={mediaType} />
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
        .slice(0, 5)
        .reverse()
        .slice(0, 4)
        .reverse();

  return (
    <div className="py-2 grid grid-cols-2 grid-flow-row gap-1">
      {images.map((image, i) => {
        return (
          <div key={i} className={"grid"} style={{ aspectRatio: "16 / 9" }}>
            <LoadingImage
              className="rounded-sm"
              loading={image === undefined}
              url={image && imageURL(image.file_path, "w780")}
            />
          </div>
        );
      })}
    </div>
  );
}

function Trailers({ id, mediaType }: { id: number; mediaType: MediaType }) {
  const videosQuery = useVideosQuery({
    id,
    type: mediaType === "show" ? "tv" : mediaType,
  });

  if (videosQuery.isError) {
    // TODO: Handle errors
    return <>This is very bad!</>;
  }

  if (videosQuery.isLoading || videosQuery.isUninitialized) {
    return <></>;
  }

  const trailers = videosQuery.data.results.filter((v) => v.type === "Trailer");
  const youtube = trailers.find((v) => v.site === "YouTube");
  const vimeo = trailers.find((v) => v.site === "Vimeo");

  return (
    <div className="w-full grid-cols-1 grid gap-2 mt-3">
      {youtube && (
        <a
          href={`https://www.youtube.com/watch?v=${youtube.key}`}
          target="_blank"
          className="py-2 w-full text-center font-semibold rounded-md bg-red-600"
        >
          <VscPlayCircle className="inline" /> YouTube
        </a>
      )}
      {vimeo && (
        <a
          href={`https://vimeo.com/${vimeo.key}`}
          target="_blank"
          className="py-2 w-full text-center font-semibold rounded-md bg-cyan-600"
        >
          <VscPlayCircle className="inline" /> Vimeo
        </a>
      )}
    </div>
  );
}
