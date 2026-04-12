import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const applicantSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    resumeText: { type: String }, // Can be the parsed text
    resumeUrl: { type: String }, // R2/Cloudflare URL
    status: {
      type: String,
      enum: ["pending", "screened", "rejected", "shortlisted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Applicant = models.Applicant || model("Applicant", applicantSchema);
