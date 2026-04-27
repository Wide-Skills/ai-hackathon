import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  applicantsViewMode: "grid" | "table";
  jobsViewMode: "grid" | "table";
}

const getInitialState = (): UIState => {
  if (typeof window === "undefined") {
    return {
      applicantsViewMode: "grid",
      jobsViewMode: "grid",
    };
  }

  try {
    const saved = localStorage.getItem("ui-preferences");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load UI preferences", e);
  }

  return {
    applicantsViewMode: "grid",
    jobsViewMode: "grid",
  };
};

const uiSlice = createSlice({
  name: "ui",
  initialState: getInitialState(),
  reducers: {
    setApplicantsViewMode: (state, action: PayloadAction<"grid" | "table">) => {
      state.applicantsViewMode = action.payload;
      localStorage.setItem("ui-preferences", JSON.stringify(state));
    },
    setJobsViewMode: (state, action: PayloadAction<"grid" | "table">) => {
      state.jobsViewMode = action.payload;
      localStorage.setItem("ui-preferences", JSON.stringify(state));
    },
  },
});

export const { setApplicantsViewMode, setJobsViewMode } = uiSlice.actions;
export default uiSlice.reducer;
