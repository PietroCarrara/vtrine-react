import { classes } from "../../utils/utils";
import { loadingColor } from "../style";

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
          [`rounded animate-pulse text-transparent bg-${loadingColor}`]:
            loading,
          [loadedClassName]: !loading,
        }) + className
      }
    >
      {text}
    </span>
  );
}
