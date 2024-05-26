import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { tmdb } from "./tmdb";
import { torrentio } from "./torrentio";
import { transmission } from "./transmission";
import { searchSlice } from "./search";
import { store as storeHack } from "./storeHack";
import { auth } from "./auth.slice";

export const store = configureStore({
  reducer: {
    [tmdb.reducerPath]: tmdb.reducer,
    [torrentio.reducerPath]: torrentio.reducer,
    [transmission.reducerPath]: transmission.reducer,
    [searchSlice.name]: searchSlice.reducer,
    [auth.name]: auth.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat([
      tmdb.middleware,
      torrentio.middleware,
      transmission.middleware,
    ]),
});
storeHack.getState = store.getState;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
