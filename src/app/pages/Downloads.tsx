import React from "react";
import {
  TransmissionDownload,
  useDownloadsQuery,
  useRemoveDownloadsMutation,
} from "../../redux/transmission";
import {
  MediaType,
  imageURL,
  useMovieDetailsQuery,
  useMovieImagesQuery,
  useShowDetailsQuery,
  useShowImagesQuery,
} from "../../redux/tmdb";
import { VscTrash } from "react-icons/vsc";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingText } from "../components/LoadingText";
import { decodeData } from "../../utils/data-encoding";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/utils";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";

export const dataKey = "vuetrine-data:";

export function Downloads() {
  const donwloadsQuery = useDownloadsQuery(undefined, {
    pollingInterval: 15 * 1000,
  });

  const Base = ({ children }: { children: React.ReactNode }) => (
    <div>
      <h2 className="text-xl font-black my-4 mx-3">Downloads</h2>
      <div className="grid grid-cols-1 gap-2 mx-3">{children}</div>
    </div>
  );

  if (donwloadsQuery.isError) {
    return (
      <Base>
        <ErrorAlert text="An error occurred while loading your downloads" />
      </Base>
    );
  }

  if (donwloadsQuery.isLoading || donwloadsQuery.isUninitialized) {
    return (
      <Base>
        <LoadingSpinner />
      </Base>
    );
  }

  const mediasDownloading = donwloadsQuery.data
    .map((d) => {
      // Fetch json metadata from torrent via "tags"
      const label = d.labels.find((l) => l.startsWith(dataKey));
      const json = label ? label.substring(dataKey.length) : undefined;

      if (!json) {
        return undefined;
      }

      const obj = decodeData(json);
      if (!obj) {
        return undefined;
      }

      return {
        tmdb: obj.tmdb,
        type: obj.type,
        download: d,
        downloadId: d.id,
        completion: d.percentDone,
        state: d.status,
      };
    })
    .filter((id): id is Exclude<typeof id, undefined> => id !== undefined);

  return (
    <>
      <Base>
        <div className="gap-2 grid grid-cols-1">
          {mediasDownloading.map((media) => (
            <MediaDownload
              key={media.tmdb}
              mediaId={media.tmdb}
              mediaType={media.type}
              download={media.download}
            />
          ))}
        </div>
      </Base>
    </>
  );
}

function MediaDownload({
  mediaId,
  mediaType,
  download,
}: {
  mediaId: number;
  mediaType: MediaType;
  download: TransmissionDownload;
}) {
  const [deleteDownload, deletionStatus] = useRemoveDownloadsMutation();

  const queries = {
    movie: useMovieDetailsQuery(mediaId, {
      skip: mediaType !== "movie",
    }),
    show: useShowDetailsQuery(mediaId, {
      skip: mediaType !== "show",
    }),
  };
  const imageQueries = {
    movie: useMovieImagesQuery(
      { id: mediaId },
      {
        skip: mediaType !== "movie",
      }
    ),
    show: useShowImagesQuery(
      { id: mediaId },
      {
        skip: mediaType !== "show",
      }
    ),
  };

  const colors = {
    stopped: "bg-red-500",
    "on-queue-to-verify-local-data": "bg-red-500",
    "verifying-local-data": "bg-red-500",
    "on-queue-to-download": "bg-blue-500",
    downloading: "bg-blue-500",
    "on-queue-to-seed": "bg-green-500",
    seeding: "bg-green-500",
  };

  const mediaQuery = queries[mediaType];
  const imageQuery = imageQueries[mediaType];

  // First backdrop with a language or undefined
  const image = imageQuery.data?.backdrops
    .slice()
    .sort((a, b) => {
      if (
        a.iso_639_1 === b.iso_639_1 ||
        (a.iso_639_1 !== "xx" && b.iso_639_1 !== "xx")
      ) {
        return b.vote_average - a.vote_average;
      }

      return a.iso_639_1 === "xx" ? 1 : -1;
    })
    .find(() => true);

  return (
    <div className="w-full grid grid-cols-12 gap-2">
      <div className="col-span-5" style={{ height: "5rem", width: "100%" }}>
        <Link
          to={`/${mediaType}/${slugify(mediaQuery.data?.title)}-${mediaId}`}
        >
          <LoadingImage
            className="rounded"
            loading={imageQuery.isLoading}
            url={image && imageURL(image.file_path, "w300")}
          />
        </Link>
      </div>
      <div className="col-span-5 m-auto w-full">
        <LoadingText
          className="font-bold text-sm"
          loading={mediaQuery.isLoading}
          text={mediaQuery.data?.title}
        />
        <div className="w-full bg-white h-1 my-1">
          <div
            className={`h-full ${colors[download.status]}`}
            style={{
              width: `${Math.max(4, download.percentDone * 100)}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="m-auto col-span-2 w-full flex justify-evenly">
        <button
          className="rounded bg-red-500 p-2 text-center"
          onClick={() =>
            deleteDownload({ ids: [download.id], deleteData: true })
          }
        >
          {deletionStatus.isLoading ? <LoadingSpinner /> : <VscTrash />}
        </button>
      </div>
    </div>
  );
}
