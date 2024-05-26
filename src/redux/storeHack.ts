import { RootState } from "./store";

// Hack to avoid circular dependency between store and tmdb api
export const store: { getState: () => RootState } = {
  getState: null!,
};
