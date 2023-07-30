import { VscAdd } from "react-icons/vsc";
import { useMovieQuery } from "../../redux/torrentio";
import { LoadingText } from "../components/LoadingText";

export function MovieDownloads({ imdbId }: { imdbId: string }) {
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
        <LoadingText loading={true} />
      </>
    );
  }

  return (
    <div>
      {header}
      {downloadsQuery.data.streams.map((s) => (
        <div
          className="my-2 grid grid-cols-5 bg-neutral-700  rounded p-2"
          key={s.infoHash}
        >
          <span className="col-span-4" style={{ overflowWrap: "break-word" }}>
            {s.title}
          </span>
          <span className="bg-green-500 rounded-full shadow p-2 m-auto">
            <VscAdd className="m-auto" />
          </span>
        </div>
      ))}
    </div>
  );
}
