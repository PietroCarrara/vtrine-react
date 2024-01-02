import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { tmdb } from "./tmdb";
import { torrentio } from "./torrentio";
import { transmission } from "./transmission";
import { searchSlice } from "./search";

export const store = configureStore({
  reducer: {
    [tmdb.reducerPath]: tmdb.reducer,
    [torrentio.reducerPath]: torrentio.reducer,
    [transmission.reducerPath]: transmission.reducer,
    [searchSlice.name]: searchSlice.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat([
      tmdb.middleware,
      torrentio.middleware,
      transmission.middleware,
    ]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
