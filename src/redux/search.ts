import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "./hooks";

export const searchSlice = createSlice({
  initialState: "",
  name: "search",
  reducers: {
    search(_, action: PayloadAction<string>) {
      return action.payload;
    },
    reset() {
      return "";
    },
  },
});

export function useSearch() {
  const search = useAppSelector((s) => s.search);
  const dispatch = useAppDispatch();

  return {
    search,
    setSearch: (search: string) => dispatch(searchSlice.actions.search(search)),
    resetSearch: () => dispatch(searchSlice.actions.reset()),
  };
}
