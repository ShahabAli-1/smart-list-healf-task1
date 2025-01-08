'use client'
import { configureStore } from "@reduxjs/toolkit";
import smartListReducer from "./slices/smartListSlice";

export const store = configureStore({
  reducer: {
    smartList: smartListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
