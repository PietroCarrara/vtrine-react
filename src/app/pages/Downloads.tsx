import React from "react";
import { useDownloadsQuery } from "../../redux/transmission";
import { LoadingMediaCard, MediaCard } from "../widgets/MediaCard";
import { Sidescroller } from "../components/Sidescroller";
import { Buffer } from "buffer";

const tmdbIdKey = "tmdb-id:";
const legacyKey = "vuetrine-data:";

export function Downloads() {
  const donwloadsQuery = useDownloadsQuery();

  const Base = ({ children }: { children: React.ReactNode }) => (
    <div>
      <h2 className="text-xl font-black mb-4">Downloads</h2>
      <Sidescroller>
        <div className="flex space-x-4">{children}</div>
      </Sidescroller>
    </div>
  );

  if (donwloadsQuery.isError) {
    // TODO: Handle error
    return <Base>This is very bad!</Base>;
  }

  if (donwloadsQuery.isLoading || donwloadsQuery.isUninitialized) {
    return (
      <Base>
        <LoadingMediaCard />
        <LoadingMediaCard />
        <LoadingMediaCard />
      </Base>
    );
  }

  const mediasDownloading = donwloadsQuery.data
    .map((d) => {
      // Fetch json metadata from torrent via "tags"
      const label = d.labels.find((l) => l.startsWith(tmdbIdKey));
      const legacyLabel = d.labels.find((l) => l.startsWith(legacyKey));
      const json = label
        ? label.substring(tmdbIdKey.length)
        : legacyLabel
        ? legacyLabel.substring(legacyKey.length)
        : undefined;

      if (!json) {
        return undefined;
      }

      const str = Buffer.from(json, "base64").toString("utf-8");
      const obj = JSON.parse(str);
      if (
        typeof obj.tmdb !== "number" ||
        !["show", "movie"].includes(obj.type)
      ) {
        return undefined;
      }

      return {
        downloadId: d.id,
        completion: d.percentDone,
        tmdb: obj.tmdb as number,
        type: obj.type as "show" | "movie",
      };
    })
    .filter((id): id is Exclude<typeof id, undefined> => id !== undefined);

  return (
    <Base>
      {mediasDownloading.map((media) => (
        <MediaCard key={media.tmdb} id={media.tmdb} type={media.type} />
      ))}
    </Base>
  );
}

function DownloadCard() {}
