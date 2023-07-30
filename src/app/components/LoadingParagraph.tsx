import { loadingColor } from "../style";

export function LoadingParagraph({
  text = "Placeholder",
  loading,
  className = "",
  loadedClassName = "",
}: {
  text?: string;
  loading: boolean;
  className?: string;
  loadedClassName?: string;
}) {
  if (loading) {
    return (
      <div className={`animate-pulse text-${loadingColor}`}>
        <div className={`rounded mb-1 bg-${loadingColor}`}>placeholder</div>
        <div className={`rounded mb-1 bg-${loadingColor}`}>placeholder</div>
        <div className={`rounded mb-1 bg-${loadingColor}`}>placeholder</div>
        <div className={`rounded mb-1 bg-${loadingColor} w-2/3`}>
          placeholder
        </div>
      </div>
    );
  }

  return <p className={loadedClassName + " " + className}>{text}</p>;
}
