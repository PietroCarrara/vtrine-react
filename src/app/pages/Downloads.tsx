import React from "react";
import {
  TransmissionDownload,
  useDownloadsQuery,
} from "../../redux/transmission";
import { LoadingMediaCard } from "../widgets/MediaCard";
import {
  MediaType,
  imageURL,
  useMovieDetailsQuery,
  useMovieImagesQuery,
  useShowDetailsQuery,
  useShowImagesQuery,
} from "../../redux/tmdb";
import { VscCheck, VscCloudDownload, VscDebugStop } from "react-icons/vsc";
import { LoadingImage } from "../components/LoadingImage";
import { LoadingText } from "../components/LoadingText";
import { decodeData } from "../../utils/data-encoding";

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
    // TODO: Handle error
    return <Base>This is very bad!</Base>;
  }

  if (donwloadsQuery.isLoading || donwloadsQuery.isUninitialized) {
    // TODO: Replace thiese with actual Loading Download Cards, or even just a spinner
    return (
      <Base>
        <LoadingMediaCard />
        <LoadingMediaCard />
        <LoadingMediaCard />
        <LoadingMediaCard />
        <LoadingMediaCard />
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
  const queries = {
    movie: useMovieDetailsQuery,
    show: useShowDetailsQuery,
  };
  const imageQueries = {
    movie: useMovieImagesQuery,
    show: useShowImagesQuery,
  };

  const icons = {
    stopped: VscDebugStop,
    "on-queue-to-verify-local-data": VscDebugStop,
    "verifying-local-data": VscDebugStop,
    "on-queue-to-download": VscCloudDownload,
    downloading: VscCloudDownload,
    "on-queue-to-seed": VscCheck,
    seeding: VscCheck,
  };
  const Icon = icons[download.status];

  const mediaQuery = queries[mediaType](mediaId);
  const imageQuery = imageQueries[mediaType]({ id: mediaId });

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
        <LoadingImage
          className="rounded"
          loading={imageQuery.isLoading}
          url={image && imageURL(image.file_path, "w300")}
        />
      </div>
      <div className="col-span-5 m-auto w-full">
        <LoadingText
          className="font-bold text-sm"
          loading={mediaQuery.isLoading}
          text={mediaQuery.data?.title}
        />
        <div className="w-full bg-white h-1 my-1">
          <div
            className="h-full bg-green-500"
            style={{
              width: `${Math.max(4, download.percentDone * 100)}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="m-auto">
        <Icon />
      </div>
    </div>
  );
}
