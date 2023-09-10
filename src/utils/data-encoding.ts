export function encodeData(obj: { tmdb: number; type: "show" | "movie" }) {
  return window.btoa(JSON.stringify(obj));
}

export function decodeData(encoded: string) {
  const json = window.atob(encoded);

  const result = safeParseJson(json);
  if (!result.ok) {
    return undefined;
  }

  const obj = result.obj;
  if (typeof obj.tmdb !== "number" || !["show", "movie"].includes(obj.type)) {
    return undefined;
  }

  return {
    tmdb: obj.tmdb as number,
    type: obj.type as "show" | "movie",
  };
}

function safeParseJson(json: string) {
  try {
    return { ok: true, obj: JSON.parse(json) } as const;
  } catch {
    return { ok: false } as const;
  }
}
