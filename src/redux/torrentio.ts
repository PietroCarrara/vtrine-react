import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

const movieResults = z.object({
  streams: z
    .object({
      name: z.string(),
      title: z.string(),
      infoHash: z.string(),
      fileIdx: z.number().int().optional(),
      behaviorHints: z.object({
        bingeGroup: z
          .string()
          .transform((s) => s.split("|"))
          .nullable()
          .optional(),
      }),
    })
    .array(),
});

export type MovieResults = z.infer<typeof movieResults>;

export const torrentio = createApi({
  reducerPath: "torrentio-api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://torrentio.strem.fun/stream",
  }),
  endpoints: (builder) => ({
    movie: builder.query({
      query: (imdbId: string) => `movie/${imdbId}.json`,
      transformResponse: (base) => movieResults.parse(base),
    }),
  }),
});

export const { useMovieQuery } = torrentio;
