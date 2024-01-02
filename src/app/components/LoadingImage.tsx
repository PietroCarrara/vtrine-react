import { classes } from "../../utils/utils";

export function LoadingImage({
  url,
  text,
  loading,
  className = "",
}: {
  url?: string;
  text?: string;
  loading: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        "bg-cover bg-center" +
        classes({
          [`animate-pulse bg-neutral-500`]: loading,
        }) +
        className
      }
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: url ? `url(${url})` : undefined,
      }}
    >
      {text}
    </div>
  );
}
