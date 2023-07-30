export function range(count: number) {
  return Array.apply(null, Array(count)).map((_, i) => i);
}

export function classes(conditionList: { [className: string]: boolean }) {
  return (
    " " +
    Object.keys(conditionList)
      .filter((className) => conditionList[className])
      .join(" ") +
    " "
  );
}
