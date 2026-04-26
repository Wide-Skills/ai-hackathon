import type { Job as JobRecord } from "@ai-hackathon/shared";
import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String },
    location: { type: String },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Remote"],
      default: "Full-time",
    },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    minExperience: { type: Number, default: 0 },
    educationLevel: {
      type: String,
      enum: ["High School", "Bachelor's", "Master's", "PhD", "Any"],
      default: "Bachelor's",
    },
    screeningFocus: { type: String },
    salaryMin: { type: Number },

    salaryMax: { type: Number },
    currency: { type: String, default: "USD" },
    closingDate: { type: String },
    createdByUserId: { type: String, ref: "User" },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    autoRejectThreshold: { type: Number, default: 50 },
    needsReviewThreshold: { type: Number, default: 70 },
    version: { type: Number, default: 1 },
    applicantsCount: { type: Number, default: 0 },
    screenedCount: { type: Number, default: 0 },
    shortlistedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export interface JobDocument
  extends Omit<JobRecord, "id" | "createdAt" | "updatedAt"> {
  createdByUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Job = mongoose.models.Job
  ? mongoose.model<JobDocument>("Job")
  : mongoose.model<JobDocument>("Job", jobSchema);
