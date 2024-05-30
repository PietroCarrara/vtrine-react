import { ReactNode, useEffect, useRef } from "react";

export function Sidescroller({
  children,
  onScrollEnd,
}: {
  children?: ReactNode[] | ReactNode;
  onScrollEnd?: (scrollPercent: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    const div = ref.current;

    div.onscrollend = () => {
      const scrollPosition = div.scrollLeft;
      const width = div.scrollWidth - div.clientWidth;

      onScrollEnd?.(scrollPosition / width);
    };

    return () => {
      div.onscrollend = null;
    };
  }, [onScrollEnd]);

  return (
    <div ref={ref} className="overflow-auto whitespace-nowrap pl-3">
      {children}
    </div>
  );
}
