import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { z } from "zod";

let token = "none";

const torrentFields = [
  "id",
  "downloadDir",
  "totalSize",
  "percentDone",
  "status",
  "labels",
];

const torrents = z
  .object({
    id: z.number().int(),
    downloadDir: z.string(),
    totalSize: z.number().int(),
    percentDone: z.number().min(0).max(1),
    status: z
      .union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ])
      .transform(
        (s) =>
          ({
            0: "stopped",
            1: "on-queue-to-verify-local-data",
            2: "verifying-local-data",
            3: "on-queue-to-download",
            4: "downloading",
            5: "on-queue-to-seed",
            6: "seeding",
          }[s])
      ),
    labels: z.string().array(),
  })
  .array();

function successOf<T extends z.ZodTypeAny, K extends string>(obj: T, key: K) {
  return z.object({
    result: z.literal("success"),
    arguments: z.object({
      [key]: obj,
    }),
  });
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_TRANSMISSION_HOST}/${process.env.REACT_APP_TRANSMISSION_BASE_URL}`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  prepareHeaders(headers, _) {
    headers.append("X-Transmission-Session-Id", token);
  },
});

const baseQueryWithAuth: BaseQueryFn<FetchArgs | string> = async (
  args,
  api,
  extraOptions
) => {
  const res = await baseQuery(args, api, extraOptions);

  // Handle auth token
  if (
    res.error &&
    typeof res.error.status === "number" &&
    res.error.status === 409 &&
    res.meta?.response?.headers.has("X-Transmission-Session-Id")
  ) {
    token = res.meta.response.headers.get("X-Transmission-Session-Id")!;
    return baseQuery(args, api, extraOptions);
  }

  // Handle auth token when server did not respond valid JSON
  if (
    res.error &&
    res.error.status === "PARSING_ERROR" &&
    res.error.originalStatus === 409 &&
    res.meta?.response?.headers.has("X-Transmission-Session-Id")
  ) {
    token = res.meta.response.headers.get("X-Transmission-Session-Id")!;
    return baseQuery(args, api, extraOptions);
  }

  return res;
};

export const transmission = createApi({
  reducerPath: "transmission-api",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    downloads: builder.query({
      query: (_: void) => ({
        url: "/",
        body: {
          method: "torrent-get",
          arguments: {
            fields: torrentFields,
          },
        },
      }),
      transformResponse: (base) =>
        successOf(torrents, "torrents").parse(base).arguments.torrents,
    }),

    addDownload: builder.mutation({
      query: ({
        magnet,
        downloadDir,
      }: {
        magnet: string;
        downloadDir?: string;
      }) => ({
        url: "/",
        body: {
          method: "torrent-add",
          arguments: {
            filename: magnet,
            "download-dir": downloadDir,
          },
        },
      }),
    }),
  }),
});

export const { useDownloadsQuery } = transmission;
