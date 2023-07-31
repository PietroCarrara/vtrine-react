import { VscAdd } from "react-icons/vsc";
import { useMovieQuery } from "../../redux/torrentio";
import { LoadingParagraph } from "../components/LoadingParagraph";
import { useAddDownloadMutation } from "../../redux/transmission";

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

export function MovieDownloads({
  imdbId,
  title,
}: {
  imdbId: string;
  title: string;
}) {
  const downloadsQuery = useMovieQuery(imdbId);
  const [addTorrent] = useAddDownloadMutation();
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
          <Box key={s.infoHash}>
            <div className="grid grid-cols-5">
              <span
                className="col-span-4"
                style={{ overflowWrap: "break-word" }}
              >
                {s.title}
              </span>
              <span
                className="bg-green-500 rounded-full shadow p-2 m-auto cursor-pointer"
                onClick={() => {
                  const magnet = `magnet:?xt=urn:btih:${
                    s.infoHash
                  }&dn=${title}&tr=${trackers.join("&tr=")}`;

                  addTorrent({ magnet });
                }}
              >
                <VscAdd className="m-auto" />
              </span>
            </div>
          </Box>
        ))}
      </div>
    </div>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <div className="my-2 bg-neutral-700 rounded p-2">{children}</div>;
}
