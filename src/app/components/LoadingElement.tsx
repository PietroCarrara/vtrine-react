import { classes } from "../../utils/utils";
import { loadingColor } from "../style";

export function LoadingElement({
  children,
  loading,
  className = "",
  loadedClassName = "",
}: {
  loading: boolean;
  className?: string;
  loadedClassName?: string;
  children?: React.ReactNode[] | React.ReactNode;
}) {
  return (
    <div
      className={
        classes({
          [`rounded animate-pulse text-${loadingColor}`]: loading,
          [loadedClassName]: !loading,
        }) + className
      }
    >
      {children}
    </div>
  );
}
