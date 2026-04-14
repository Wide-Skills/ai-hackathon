import type { ScreeningResult as ScreeningResultRecord } from "@ai-hackathon/shared";
import mongoose from "mongoose";

const { Schema } = mongoose;

const screeningSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    matchScore: { type: Number, min: 0, max: 100, required: true },
    strengths: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    recommendation: { type: String, required: true },
  },
  { timestamps: true },
);

export interface ScreeningResultDocument
  extends Omit<
    ScreeningResultRecord,
    "id" | "applicantId" | "jobId" | "createdAt" | "updatedAt"
  > {
  applicantId: mongoose.Types.ObjectId | string;
  jobId: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ScreeningResult = mongoose.models.ScreeningResult
  ? mongoose.model<ScreeningResultDocument>("ScreeningResult")
  : mongoose.model<ScreeningResultDocument>("ScreeningResult", screeningSchema);
