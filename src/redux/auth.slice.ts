import { PayloadAction, createSlice } from "@reduxjs/toolkit";
const localStorageKey = "auth.tmdbSession";

type AuthState =
  | {
      authenticated: false;
    }
  | {
      authenticated: true;
      tmdbSession: string;
    };

export const auth = createSlice({
  initialState: initialState(),
  name: "auth",
  reducers: {
    authenticate(state, tmdbSessionPayload: PayloadAction<string>) {
      // FIXME: maybe not the best place to put a side-effect?
      localStorage.setItem(localStorageKey, tmdbSessionPayload.payload);

      return {
        authenticated: true,
        tmdbSession: tmdbSessionPayload.payload,
      };
    },
  },
});

export const { authenticate } = auth.actions;

function initialState(): AuthState {
  const session = localStorage.getItem(localStorageKey);

  if (session === null) {
    return {
      authenticated: false,
    };
  }

  return {
    authenticated: true,
    tmdbSession: session,
  };
}
