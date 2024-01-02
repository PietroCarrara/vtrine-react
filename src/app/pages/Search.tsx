import { useCallback, useEffect, useState } from "react";
import { useSearch } from "../../redux/search";
import { useLazyMultiSearchQuery } from "../../redux/tmdb";
import { range } from "../../utils/utils";
import { DisplayMediaCard, LoadingMediaCard } from "../widgets/MediaCard";
import debounce from "debounce";

const map = {
  tv: "show",
  movie: "movie",
} as const;

export function Search() {
  return (
    <div className="m-3">
      <Results />
    </div>
  );
}

function Results() {
  const { search } = useSearch();
  const [isTyping, setIsTyping] = useState(false);
  const [triggerSearch, searchQuery] = useLazyMultiSearchQuery();
  useEffect(() => {
    triggerSearch({
      query: search,
    });
  }, []);

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setIsTyping(false);
      triggerSearch({
        query: search.trim(),
      });
    }, 300),
    [triggerSearch]
  );
  const doSearch = async () => {
    setIsTyping(true);
    debouncedSearch(search);
  };
  useEffect(() => void doSearch(), [search]);

  if (searchQuery.isError) {
    // TODO: Deal with errors
    return <>This is very bad</>;
  }

  if (searchQuery.isUninitialized || search === "") {
    return <></>;
  }

  if (searchQuery.isLoading || searchQuery.isFetching || isTyping) {
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
      {searchQuery.data.results
        .filter(
          (i): i is Exclude<typeof i, { media_type: "person" }> =>
            i.media_type !== "person"
        )
        .map((item) => (
          <DisplayMediaCard
            key={item.id}
            media={{ ...item, state: "loaded", type: map[item.media_type] }}
          />
        ))}
    </Container>
  );
}

function Container({ children }: { children: React.ReactNode[] }) {
  return <div className="grid grid-cols-2 grid-flow-row gap-4">{children}</div>;
}
