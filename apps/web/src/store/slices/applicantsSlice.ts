import type { ApplicationStatus } from "@ai-hackathon/shared";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ApplicantsState {
  statusFilter: ApplicationStatus | "all";
  sortByScoreDesc: boolean;
  selectedApplicantId: string | null;
}

const initialState: ApplicantsState = {
  statusFilter: "all",
  sortByScoreDesc: true,
  selectedApplicantId: null,
};

const applicantsSlice = createSlice({
  name: "applicants",
  initialState,
  reducers: {
    setStatusFilter: (
      state,
      action: PayloadAction<ApplicantsState["statusFilter"]>,
    ) => {
      state.statusFilter = action.payload;
    },
    setSortByScoreDesc: (state, action: PayloadAction<boolean>) => {
      state.sortByScoreDesc = action.payload;
    },
    setSelectedApplicantId: (state, action: PayloadAction<string | null>) => {
      state.selectedApplicantId = action.payload;
    },
  },
});

export const { setStatusFilter, setSortByScoreDesc, setSelectedApplicantId } =
  applicantsSlice.actions;
export default applicantsSlice.reducer;
