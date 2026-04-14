import { configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import applicantsReducer from "./slices/applicantsSlice";
import jobsReducer from "./slices/jobsSlice";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    applicants: applicantsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
