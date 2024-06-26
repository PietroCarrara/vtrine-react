import { useCallback, useEffect, useState } from "react";
import { useSearch } from "../../redux/search";
import { useLazyMultiSearchQuery } from "../../redux/tmdb";
import { range } from "../../utils/utils";
import { DisplayMediaCard, LoadingMediaCard } from "../widgets/MediaCard";
import debounce from "debounce";
import { ErrorAlert } from "../components/ErrorAlert";

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
    // We only want to run once, therefore we use the empty array
    // eslint-disable-next-line
  }, []);

  // useCallback expect an inline function (why?)
  // eslint-disable-next-line
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setIsTyping(false);
      triggerSearch({
        query: search.trim(),
      });
    }, 300),
    [triggerSearch]
  );
  useEffect(() => {
    setIsTyping(true);
    debouncedSearch(search);
  }, [search, debouncedSearch, setIsTyping]);

  if (searchQuery.isError) {
    return <ErrorAlert text="An error occurred while searching" />;
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
