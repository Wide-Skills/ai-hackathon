import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface JobsState {
  searchKeyword: string;
  selectedJobId: string | null;
}

const initialState: JobsState = {
  searchKeyword: "",
  selectedJobId: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    setSelectedJobId: (state, action: PayloadAction<string | null>) => {
      state.selectedJobId = action.payload;
    },
  },
});

export const { setSearchKeyword, setSelectedJobId } =
  jobsSlice.actions;
export default jobsSlice.reducer;
