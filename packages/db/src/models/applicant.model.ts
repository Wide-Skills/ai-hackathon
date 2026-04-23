import type { Applicant as ApplicantRecord } from "@ai-hackathon/shared";
import mongoose from "mongoose";

const { Schema } = mongoose;

const availabilitySchema = new Schema(
  {
    status: String,
    type: String,
    startDate: String,
  },
  { _id: false },
);

const applicantSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: String, ref: "User" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String }, // For convenience, though we have first/last
    email: { type: String, required: true },
    headline: { type: String },
    bio: { type: String },
    location: { type: String },
    avatarUrl: { type: String },
    resumeText: { type: String },
    resumeUrl: { type: String },
    appliedAt: { type: String },
    status: {
      type: String,
      enum: ["pending", "screening", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
    skills: [
      {
        name: String,
        level: String,
        yearsOfExperience: Number,
      },
    ],
    languages: [
      {
        name: String,
        proficiency: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
        technologies: [String],
        isCurrent: Boolean,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        role: String,
        link: String,
        startDate: String,
        endDate: String,
      },
    ],
    availability: availabilitySchema,
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
      twitter: String,
    },
    screening: {
      type: {
        matchScore: Number,
        strengths: [String],
        gaps: [String],
        recommendation: String,
        summary: String,
        skillBreakdown: [
          {
            skill: String,
            score: Number,
          },
        ],
      },
      default: undefined,
    },
  },
  { timestamps: true },
);

export interface ApplicantDocument
  extends Omit<ApplicantRecord, "id" | "jobId" | "createdAt" | "updatedAt"> {
  jobId: mongoose.Types.ObjectId | string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Applicant = mongoose.models.Applicant
  ? mongoose.model<ApplicantDocument>("Applicant")
  : mongoose.model<ApplicantDocument>("Applicant", applicantSchema);
