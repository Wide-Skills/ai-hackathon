import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface JobsState {
  searchKeyword: string;
  selectedJobId: string | null;
  isCreateModalOpen: boolean;
}

const initialState: JobsState = {
  searchKeyword: "",
  selectedJobId: null,
  isCreateModalOpen: false,
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
    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
  },
});

export const { setSearchKeyword, setSelectedJobId, setCreateModalOpen } = jobsSlice.actions;
export default jobsSlice.reducer;
