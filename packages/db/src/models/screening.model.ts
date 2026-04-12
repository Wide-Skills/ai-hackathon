import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const screeningSchema = new Schema(
  {
    applicantId: { type: Schema.Types.ObjectId, ref: "Applicant", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    matchScore: { type: Number, min: 0, max: 100, required: true },
    strengths: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    recommendation: { type: String, required: true },
  },
  { timestamps: true }
);

export const ScreeningResult = models.ScreeningResult || model("ScreeningResult", screeningSchema);
