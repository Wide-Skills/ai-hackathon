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
    createdByUserId: { type: String, ref: "User" },
    matchScore: { type: Number, min: 0, max: 100, required: true },
    scoreBreakdown: {
      technicalSkills: { type: Number, min: 0, max: 100 },
      experience: { type: Number, min: 0, max: 100 },
      education: { type: Number, min: 0, max: 100 },
      culturalFit: { type: Number, min: 0, max: 100 },
    },
    strengths: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    recommendation: { type: String, required: true },
    summary: { type: String },
    manualScore: { type: Number, min: 0, max: 100 },
    recruiterNotes: { type: String },
    isOutdated: { type: Boolean, default: false },
    jobVersion: { type: Number, default: 1 },
    skillBreakdown: [
      {
        skill: { type: String, required: true },
        score: { type: Number, min: 0, max: 100, required: true },
      },
    ],
  },
  { timestamps: true },
);

// Performance indexes
screeningSchema.index({ applicantId: 1 });
screeningSchema.index({ jobId: 1 });

export interface ScreeningResultDocument
  extends Omit<
    ScreeningResultRecord,
    "id" | "applicantId" | "jobId" | "createdAt" | "updatedAt"
  > {
  applicantId: mongoose.Types.ObjectId | string;
  jobId: mongoose.Types.ObjectId | string;
  createdByUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ScreeningResult = mongoose.models.ScreeningResult
  ? mongoose.model<ScreeningResultDocument>("ScreeningResult")
  : mongoose.model<ScreeningResultDocument>("ScreeningResult", screeningSchema);
