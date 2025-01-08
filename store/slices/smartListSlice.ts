import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { YelpItem } from "@/types";

interface SmartListState {
  itemsByPage: Record<number, YelpItem[]>; // Store items by page number
  loading: boolean;
  total: number;
}

const initialState: SmartListState = {
  itemsByPage: {}, // Initialize an empty object to store page data
  loading: false,
  total: 0,
};

const smartListSlice = createSlice({
  name: "smartList",
  initialState,
  reducers: {
    setItemsByPage: (
      state,
      action: PayloadAction<{ page: number; items: YelpItem[] }>
    ) => {
      const { page, items } = action.payload;
      state.itemsByPage[page] = items; // Store items for the given page
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    clearItemsByPage: (state) => {
      state.itemsByPage = {}; // Clear all stored data for pages
    },
  },
});

export const { setItemsByPage, setLoading, setTotal, clearItemsByPage } = smartListSlice.actions;
export default smartListSlice.reducer;
