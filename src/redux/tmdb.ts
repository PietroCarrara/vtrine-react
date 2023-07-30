import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

export type MediaType = "movie" | "show";

const basicMovieDetails = z
  .object({
    id: z.number().int(),
    title: z.string(),
    backdrop_path: z.string().optional(),
    poster_path: z.string().optional(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    media_type: z.string().optional(),
    popularity: z.number(),
    release_date: z.string().pipe(z.coerce.date()),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number().int(),
  })
  .transform((res) => ({
    ...res,
    release_date: undefined,
    release: {
      year: res.release_date.getFullYear(),
      month: res.release_date.getMonth(),
      day: res.release_date.getDate(),
    },
  }));

const basicShowDetails = z
  .object({
    id: z.number().int(),
    name: z.string(),
    backdrop_path: z.string().optional(),
    poster_path: z.string().optional(),
    original_language: z.string(),
    original_name: z.string(),
    overview: z.string(),
    media_type: z.string().optional(),
    popularity: z.number(),
    first_air_date: z.string().pipe(z.coerce.date()),
    vote_average: z.number(),
    vote_count: z.number().int(),
  })
  .transform((res) => ({
    ...res,
    name: undefined,
    first_air_date: undefined,
    title: res.name,
    release: {
      year: res.first_air_date.getFullYear(),
      month: res.first_air_date.getMonth(),
      day: res.first_air_date.getDate(),
    },
  }));

const movieDetails = basicMovieDetails.and(
  z.object({
    tagline: z.string(),
    imdb_id: z.string().optional(),
    status: z.string(),
    genres: z.object({ id: z.number().int(), name: z.string() }).array(),
  })
);

const showDetails = basicShowDetails.and(
  z.object({
    tagline: z.string(),
    imdb_id: z.string().optional(),
    genres: z.object({ id: z.number().int(), name: z.string() }).array(),
    number_of_episodes: z.number().int(),
    number_of_seasons: z.number().int(),
  })
);

const trendingMoviesPage = z.object({
  page: z.number().int(),
  results: basicMovieDetails.array(),
});

const trendingShowsPage = z.object({
  page: z.number().int(),
  results: basicShowDetails.array(),
});

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

    showDetails: builder.query({
      query: (showId: number) => `tv/${showId}`,
      transformResponse: (baseReturn) => showDetails.parse(baseReturn),
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

    trendingShows: builder.query({
      query: ({
        timeWindow = "day",
        page = 1,
      }: {
        timeWindow?: "day" | "week";
        page?: number;
      }) => ({
        url: `trending/tv/${timeWindow}`,
        params: {
          page,
        },
      }),
      transformResponse: (baseReturn) => trendingShowsPage.parse(baseReturn),
    }),
  }),
});

export function imageURL(
  path: string,
  quality: "w300" | "w780" | "w1280" | "original"
) {
  return `http://image.tmdb.org/t/p/${quality}/${path}`;
}

export const {
  useMovieDetailsQuery,
  useShowDetailsQuery,
  useTrendingMoviesQuery,
  useTrendingShowsQuery,
} = tmdb;
