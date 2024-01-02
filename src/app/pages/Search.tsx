import { useSearch } from "../../redux/search";
import { useMultiSearchQuery } from "../../redux/tmdb";
import { range } from "../../utils/utils";
import { DisplayMediaCard, LoadingMediaCard } from "../widgets/MediaCard";

const map = {
  tv: "show",
  movie: "movie",
} as const;

export function Search() {
  const { search } = useSearch();
  const searchQuery = useMultiSearchQuery({
    query: "the killer",
  });

  if (searchQuery.isError) {
    // TODO: Deal with errors
    return <>This is very bad</>;
  }

  if (searchQuery.isLoading || searchQuery.isUninitialized) {
    return (
      <Container>
        {range(5).map((i) => (
          <LoadingMediaCard key={i} />
        ))}
      </Container>
    );
  }

  return (
    <Container>
      {searchQuery.data.results.map((item) => (
        <DisplayMediaCard
          key={item.id}
          media={{ ...item, state: "loaded", type: map[item.media_type] }}
        />
      ))}
    </Container>
  );
}

function Container({ children }: { children: React.ReactNode[] }) {
  return (
    <div className="grid grid-cols-2 grid-flow-row gap-4 m-4">{children}</div>
  );
}
