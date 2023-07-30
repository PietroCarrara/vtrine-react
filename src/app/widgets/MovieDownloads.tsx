import { VscAdd } from "react-icons/vsc";
import { useMovieQuery } from "../../redux/torrentio";
import { LoadingParagraph } from "../components/LoadingParagraph";

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
          <Box>
            <div className="grid grid-cols-5">
              <span
                className="col-span-4"
                style={{ overflowWrap: "break-word" }}
              >
                {s.title}
              </span>
              <span className="bg-green-500 rounded-full shadow p-2 m-auto">
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
