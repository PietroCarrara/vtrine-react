import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

const basicMovieDetails = z
  .object({
    id: z.number().int(),
    title: z.string(),
    backdrop_path: z.string().optional(),
    poster_path: z.string().optional(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    media_type: z.string(),
    popularity: z.number(),
    release_date: z.string().pipe(z.coerce.date()),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number().int(),
  })
  .transform((res) => ({
    ...res,
    release_date: {
      year: res.release_date.getFullYear(),
      month: res.release_date.getMonth(),
      day: res.release_date.getDate(),
    },
  }));

const movieDetails = basicMovieDetails.and(
  z.object({
    tagline: z.string(),
    status: z.string(),
    genres: z.object({ id: z.number().int(), name: z.string() }).array(),
  })
);
export type MovieDetails = z.infer<typeof movieDetails>;

const trendingMoviesPage = z.object({
  page: z.number().int(),
  results: basicMovieDetails.array(),
});
export type TrendingMoviesPage = z.infer<typeof trendingMoviesPage>;

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

    trendingMovies: builder.query({
      query: ({
        timeWindow = "day",
        page = 1,
      }: {
        timeWindow?: "day" | "week";
        page?: number;
      }) => ({
        url: `trending/movie/${timeWindow}`,
        params: {
          page,
        },
      }),
      transformResponse: (baseReturn) => trendingMoviesPage.parse(baseReturn),
    }),
  }),
});

export function imageURL(
  path: string,
  quality: "w300" | "w780" | "w1280" | "original"
) {
  return `http://image.tmdb.org/t/p/${quality}/${path}`;
}

export const { useMovieDetailsQuery, useTrendingMoviesQuery } = tmdb;
