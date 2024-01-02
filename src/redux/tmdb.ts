import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

export type MediaType = "movie" | "show";

const basicPersonDetails = z.object({
  adult: z.boolean(),
  id: z.number().int(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  gender: z.number(),
  known_for_department: z.string(),
  profile_path: z.string().optional().nullable(),
});

const basicMovieDetails = z
  .object({
    id: z.number().int(),
    title: z.string(),
    backdrop_path: z.string().optional().nullable(),
    poster_path: z.string().optional().nullable(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    release_date: z.string(),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number().int(),
  })
  .transform((res) => {
    const dateParts = res.release_date.split("-").map((x) => parseInt(x, 10));

    const release =
      dateParts.length !== 3 || dateParts.some((x) => isNaN(x))
        ? undefined
        : {
            year: dateParts[0],
            month: dateParts[1],
            day: dateParts[2],
          };

    return { ...res, release_date: undefined, release };
  });

const basicShowDetails = z
  .object({
    id: z.number().int(),
    name: z.string(),
    backdrop_path: z.string().optional().nullable(),
    poster_path: z.string().optional().nullable(),
    original_language: z.string(),
    original_name: z.string(),
    overview: z.string(),
    popularity: z.number(),
    first_air_date: z.string(),
    vote_average: z.number(),
    vote_count: z.number().int(),
  })
  .transform((res) => {
    const dateParts = res.first_air_date.split("-").map((x) => parseInt(x, 10));

    const release =
      dateParts.length !== 3 || dateParts.some((x) => isNaN(x))
        ? undefined
        : {
            year: dateParts[0],
            month: dateParts[1],
            day: dateParts[2],
          };

    return {
      ...res,
      name: undefined,
      first_air_date: undefined,
      title: res.name,
      release,
    };
  });

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

const tmdbImage = z
  .object({
    iso_639_1: z.string().nullable(),
    file_path: z.string(),
    vote_average: z.number(),
    vote_count: z.number().int(),
    aspect_ratio: z.number(),
    width: z.number().int(),
    height: z.number().int(),
  })
  .transform((i) => ({
    ...i,
    iso_639_1: i.iso_639_1 === null ? "xx" : i.iso_639_1,
  }));

const images = z.object({
  id: z.number().int(),
  backdrops: tmdbImage.array(),
  logos: tmdbImage.array(),
  posters: tmdbImage.array(),
});

const multiSearchResultItem = z.union([
  basicMovieDetails.and(
    z.object({
      media_type: z.literal("movie"),
    })
  ),
  basicShowDetails.and(
    z.object({
      media_type: z.literal("tv"),
    })
  ),
  basicPersonDetails.and(
    z.object({
      media_type: z.literal("person"),
    })
  ),
]);
const multiSearchResult = z.object({
  page: z.number().int(),
  total_pages: z.number().int(),
  total_results: z.number().int(),
  results: multiSearchResultItem.array(),
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

    movieImages: builder.query({
      query: (args: { id: number; language?: string }) => ({
        url: `movie/${args.id}/images`,
        params: {
          language: args.language === "xx" ? "null" : args.language,
        },
      }),
      transformResponse: (baseReturn) => images.parse(baseReturn),
    }),

    showImages: builder.query({
      query: (args: { id: number; language?: string }) => ({
        url: `tv/${args.id}/images`,
        params: {
          language: args.language === "xx" ? "null" : args.language,
        },
      }),
      transformResponse: (baseReturn) => images.parse(baseReturn),
    }),

    multiSearch: builder.query({
      query: ({ query, page = 1 }: { query: string; page?: number }) => ({
        url: `search/multi`,
        params: {
          query,
          page,
        },
      }),
      transformResponse: (baseReturn) => multiSearchResult.parse(baseReturn),
    }),
  }),
});

export function imageURL(
  path: string,
  quality: "w300" | "w780" | "w1280" | "original"
) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return `http://image.tmdb.org/t/p/${quality}${path}`;
}

export const {
  useMovieDetailsQuery,
  useShowDetailsQuery,
  useTrendingMoviesQuery,
  useTrendingShowsQuery,
  useMovieImagesQuery,
  useShowImagesQuery,
  useMultiSearchQuery,
  useLazyMultiSearchQuery,
} = tmdb;
