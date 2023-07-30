import { classes } from "../../utils/utils";
import { loadingColor } from "../style";

export function LoadingImage({
  url,
  loading,
  className = "",
  width,
  height,
}: {
  url?: string;
  loading: boolean;
  className?: string;
  width: number | string;
  height: number | string;
}) {
  return (
    <div
      className={
        "bg-cover bg-center" +
        classes({
          [`animate-pulse bg-${loadingColor}`]: loading,
        }) +
        className
      }
      style={{
        width,
        height,
        backgroundImage: url ? `url(${url})` : undefined,
      }}
    />
  );
}
