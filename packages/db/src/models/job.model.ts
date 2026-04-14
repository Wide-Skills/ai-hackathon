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
    requirements: { type: [String], required: true },
    skills: { type: [String], default: [] },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: "USD" },
    closingDate: { type: String },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    applicantsCount: { type: Number, default: 0 },
    screenedCount: { type: Number, default: 0 },
    shortlistedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// To avoid over-writing models in hot-reloads
export interface JobDocument
  extends Omit<JobRecord, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

export const Job = mongoose.models.Job
  ? mongoose.model<JobDocument>("Job")
  : mongoose.model<JobDocument>("Job", jobSchema);
