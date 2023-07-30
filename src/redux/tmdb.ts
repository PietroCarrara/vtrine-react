import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

const movieDetails = z
  .object({
    backdrop_path: z.string(),
    vote_average: z.number(),
    video: z.boolean(),
    tagline: z.string(),
    status: z.string(),
    release_date: z.string().pipe(z.coerce.date()),
    poster_path: z.string(),
    overview: z.string(),
    id: z.number().int(),
    genres: z.object({ id: z.number().int(), name: z.string() }).array(),
    title: z.string(),
  })
  .transform((res) => ({
    ...res,
    release_date: {
      year: res.release_date.getFullYear(),
      month: res.release_date.getMonth(),
      day: res.release_date.getDate(),
    },
  }));
export type MovieDetails = z.infer<typeof movieDetails>;

export const tmdb = createApi({
  reducerPath: "tmdb-api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org/3",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
    },
  }),
  endpoints: (builder) => ({
    movieDetails: builder.query({
      query: (movieId: number) => `movie/${movieId}`,
      transformResponse: (baseReturn) => movieDetails.parse(baseReturn),
    }),
  }),
});

export const { useMovieDetailsQuery } = tmdb;

export function imageURL(
  path: string,
  quality: "w300" | "w780" | "w1280" | "original"
) {
  return `http://image.tmdb.org/t/p/${quality}/${path}`;
}
