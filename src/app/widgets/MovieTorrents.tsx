import { VscAdd, VscCheck, VscLoading } from "react-icons/vsc";
import { MovieResults, useMovieQuery } from "../../redux/torrentio";
import { LoadingParagraph } from "../components/LoadingParagraph";
import {
  useAddDownloadMutation,
  useDownloadSetMutation,
} from "../../redux/transmission";
import { encodeData } from "../../utils/data-encoding";
import { dataKey } from "../pages/Downloads";

const trackers = [
  "udp://open.demonii.com:1337/announce",
  "udp://tracker.openbittorrent.com:80",
  "udp://tracker.coppersurfer.tk:6969",
  "udp://glotorrents.pw:6969/announce",
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://torrent.gresille.org:80/announce",
  "udp://p4p.arenabg.com:1337",
  "udp://tracker.leechers-paradise.org:6969",
];

export function MovieTorrents({
  tmdbId,
  imdbId,
}: {
  tmdbId: number;
  imdbId: string;
}) {
  const downloadsQuery = useMovieQuery(imdbId);
  const header = <h2 className="text-xl font-black my-3">Downloads</h2>;

  if (downloadsQuery.isError) {
    return (
      <>
        {header}
        {/* TODO: Handle error */}
        Something very bad happened!
      </>
    );
  }

  if (downloadsQuery.isLoading || downloadsQuery.isUninitialized) {
    return (
      <>
        {header}
        <Box>
          <LoadingParagraph loading={true} />
        </Box>
        <Box>
          <LoadingParagraph loading={true} />
        </Box>
      </>
    );
  }

  return (
    <div>
      {header}
      <div className="md:grid md:grid-cols-3 md:gap-x-3">
        {downloadsQuery.data.streams.map((s) => (
          <DownloadItem {...s} key={s.title} tmdbId={tmdbId} />
        ))}
      </div>
    </div>
  );
}

function DownloadItem({
  infoHash,
  title,
  tmdbId,
}: MovieResults["streams"][number] & { tmdbId: number }) {
  const [addTorrent, addTorrentStatus] = useAddDownloadMutation();
  const [setTorrent] = useDownloadSetMutation();

  return (
    <Box>
      <div className="grid grid-cols-5">
        <span className="col-span-4" style={{ overflowWrap: "break-word" }}>
          {title}
        </span>
        <span
          className="bg-green-500 rounded-full shadow p-2 m-auto cursor-pointer"
          onClick={async () => {
            if (addTorrentStatus.isLoading) {
              return;
            }

            const magnet = `magnet:?xt=urn:btih:${encodeURIComponent(
              infoHash
            )}&dn=${encodeURIComponent(title)}&tr=${trackers
              .map(encodeURIComponent)
              .join("&tr=")}`;

            const response = await addTorrent({
              magnet,
            });

            if ("data" in response) {
              const download =
                "torrent-added" in response.data
                  ? response.data["torrent-added"]
                  : response.data["torrent-duplicate"];

              await setTorrent({
                ids: [download.id],
                labels: [
                  dataKey +
                    encodeData({
                      type: "movie",
                      tmdb: tmdbId,
                    }),
                ],
              });
            }
          }}
        >
          {addTorrentStatus.isLoading ? (
            <VscLoading className="m-auto animate-spin" />
          ) : addTorrentStatus.isSuccess ? (
            <VscCheck className="m-auto" />
          ) : (
            <VscAdd className="m-auto" />
          )}
        </span>
      </div>
    </Box>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <div className="my-2 bg-neutral-700 rounded p-2">{children}</div>;
}
