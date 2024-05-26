import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
      // TODO: Save state on localstorage
      return {
        authenticated: true,
        tmdbSession: tmdbSessionPayload.payload,
      };
    },
  },
});

export const { authenticate } = auth.actions;

function initialState(): AuthState {
  // TODO: Check on localStorage first
  return {
    authenticated: false,
  };
}
