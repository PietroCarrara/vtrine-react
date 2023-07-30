import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { tmdb } from "./tmdb";

export const store = configureStore({
  reducer: {
    [tmdb.reducerPath]: tmdb.reducer,
  },
  middleware: (getDefault) => getDefault().concat([tmdb.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
