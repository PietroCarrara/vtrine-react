import { MediaType, imageURL } from "../../redux/tmdb";
import { slugify } from "../../utils/utils";
import { Link } from "react-router-dom";
import { LoadingText } from "../components/LoadingText";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingRating } from "./LoadingRating";

export function LoadingMediaCard() {
  return <DisplayMediaCard media={{ state: "loading" }} />;
}

export function DisplayMediaCard({
  media,
}: {
  media:
    | { state: "loading" }
    | {
        state: "loaded";
        id: number;
        poster_path?: string | null;
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
    <div
      style={{
        aspectRatio: "12 / 18",
        width: "100%",
      }}
    >
      <LoadingImage
        loading={media.state === "loading"}
        url={
          media.state === "loaded" && media.poster_path
            ? imageURL(media.poster_path, "w300")
            : undefined
        }
        text={
          media.state === "loaded" && !media.poster_path
            ? media.title
            : undefined
        }
        className="rounded mb-1 shadow-md"
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
