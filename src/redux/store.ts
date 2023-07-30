import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { tmdb } from "./tmdb";
import { torrentio } from "./torrentio";

export const store = configureStore({
  reducer: {
    [tmdb.reducerPath]: tmdb.reducer,
    [torrentio.reducerPath]: torrentio.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat([tmdb.middleware, torrentio.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
