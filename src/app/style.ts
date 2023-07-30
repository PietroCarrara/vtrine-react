export type Tone = "300" | "400" | "500";

export type ColorName = "neutral";

export type Color = `${ColorName}-${Tone}`;

export const loadingColor: Color = "neutral-300";
