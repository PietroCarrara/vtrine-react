import { classes } from "../../utils/utils";

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
          [`rounded animate-pulse text-neutral-500`]: loading,
          [loadedClassName]: !loading,
        }) + className
      }
    >
      {children}
    </div>
  );
}
