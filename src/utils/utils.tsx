import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export function slugify(str: undefined): undefined;
export function slugify(str: string): string;
export function slugify(str: string | undefined): string | undefined;
export function slugify(str: string | undefined) {
  if (str === undefined) {
    return undefined;
  }

  return str
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
}

export function Redirect({ url }: { url: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(url);
  }, [navigate, url]);

  return <></>;
}
