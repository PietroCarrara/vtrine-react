import { useMovieDetailsQuery } from "../../redux/tmdb";

export function Movie({ id }: { id: number }) {
  const movieQuery = useMovieDetailsQuery(id);

  if (movieQuery.isError || movieQuery.isUninitialized) {
    // TODO: Handle errors
    return <>This is very bad!</>;
  }

  return <>sla</>;
}
