import { VscStarEmpty, VscStarFull, VscStarHalf } from "react-icons/vsc";
import { range } from "../../utils/utils";
import { LoadingElement } from "../components/LoadingElement";

export function LoadingRating({
  loading,
  rating,
  className = "",
  loadedClassName = "",
}: {
  loading: boolean;
  rating?: number;
  className?: string;
  loadedClassName?: string;
}) {
  const scoreFromZeroToFive = (rating ?? NaN) / 2;

  return (
    <LoadingElement
      loading={loading}
      className={"inline-block " + className}
      loadedClassName={"text-yellow-500 " + loadedClassName}
    >
      {!loading && (
        <>
          {range(Math.floor(scoreFromZeroToFive)).map((i) => (
            <Star state="full" key={i} />
          ))}
          {scoreFromZeroToFive - Math.floor(scoreFromZeroToFive) >= 0.45 && (
            <>
              <Star state="half" />
              {range(Math.ceil(4 - scoreFromZeroToFive)).map((i) => (
                <Star state="empty" key={i} />
              ))}
            </>
          )}
          {!(scoreFromZeroToFive - Math.floor(scoreFromZeroToFive) >= 0.45) &&
            range(Math.ceil(5 - scoreFromZeroToFive)).map((i) => (
              <Star state="empty" key={i} />
            ))}
        </>
      )}
      {loading && range(5).map((i) => <Star key={i} state="empty" />)}
    </LoadingElement>
  );
}

function Star({ state }: { state: "full" | "half" | "empty" }) {
  const result: Record<typeof state, React.ReactElement> = {
    full: <VscStarFull style={{ display: "inline" }} />,
    half: <VscStarHalf style={{ display: "inline" }} />,
    empty: <VscStarEmpty style={{ display: "inline" }} />,
  };

  return result[state];
}
