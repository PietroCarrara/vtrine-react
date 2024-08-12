import { WarnAlert } from "../components/WarnAlert";
import { DownloadMagnet } from "./DownloadMagnet";

export function ShowTorrents({ tmdbId }: { tmdbId: number }) {
  return (
    <>
      <h2 className="text-xl font-black my-3">Downloads</h2>

      <DownloadMagnet id={tmdbId} mediaType="show" />

      <div className="my-3" />

      {/* TODO: Implement show downloading */}
      <WarnAlert text="Unfortunately, listing show downloads is not yet supported." />
    </>
  );
}
