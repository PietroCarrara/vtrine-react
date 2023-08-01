import { ReactNode } from "react";

export function Sidescroller({
  children,
}: {
  children?: ReactNode[] | ReactNode;
}) {
  return <div className="overflow-auto whitespace-nowrap pl-3">{children}</div>;
}
