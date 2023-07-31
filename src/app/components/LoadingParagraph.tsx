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
      <div className={`animate-pulse text-transparent`}>
        <div className={`rounded mb-1 bg-neutral-500`}>placeholder</div>
        <div className={`rounded mb-1 bg-neutral-500`}>placeholder</div>
        <div className={`rounded mb-1 bg-neutral-500`}>placeholder</div>
        <div className={`rounded mb-1 bg-neutral-500 w-2/3`}>placeholder</div>
      </div>
    );
  }

  return <p className={loadedClassName + " " + className}>{text}</p>;
}
