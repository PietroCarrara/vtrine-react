import { classes } from "../../utils/utils";

export function LoadingText({
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
  return (
    <span
      className={
        classes({
          [`rounded animate-pulse text-transparent bg-neutral-500`]: loading,
          [loadedClassName]: !loading,
        }) + className
      }
    >
      {text}
    </span>
  );
}
