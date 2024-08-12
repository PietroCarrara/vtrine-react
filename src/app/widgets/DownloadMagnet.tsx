import { useState } from "react";
import { MediaType } from "../../redux/tmdb";
import { VscCheck, VscLoading, VscMagnet } from "react-icons/vsc";
import {
  useAddDownloadMutation,
  useDownloadSetMutation,
} from "../../redux/transmission";
import { encodeData } from "../../utils/data-encoding";
import { dataKey } from "../pages/Downloads";

export function DownloadMagnet({
  mediaType,
  id,
}: {
  mediaType: MediaType;
  id: number;
}) {
  const [magnet, setMagnet] = useState("");
  const [addTorrent, addTorrentStatus] = useAddDownloadMutation();
  const [setTorrent] = useDownloadSetMutation();

  return (
    <form
      className="grid grid-cols-12 gap-2"
      onSubmit={async (e) => {
        e.preventDefault();

        if (addTorrentStatus.isLoading) {
          return;
        }

        const response = await addTorrent({
          magnet,
          downloadDir: process.env.REACT_APP_MOVIE_DOWNLOAD_DIR,
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
                  type: mediaType,
                  tmdb: id,
                }),
            ],
          });
        }
      }}
    >
      <input
        type="text"
        value={magnet}
        onChange={(e) => setMagnet(e.target.value)}
        placeholder="Import a custom magnet link..."
        className="col-span-10 bg-white text-black border shadow-sm w-full py-1 pl-2 focus:outline-none rounded placeholder:italic"
      />
      <button
        type="submit"
        className="col-span-2 block rounded bg-green-500 p-2 text-center"
      >
        {addTorrentStatus.isLoading ? (
          <VscLoading className="m-auto animate-spin" />
        ) : addTorrentStatus.isSuccess ? (
          <VscCheck className="m-auto" />
        ) : (
          <VscMagnet className="m-auto" />
        )}
      </button>
    </form>
  );
}
