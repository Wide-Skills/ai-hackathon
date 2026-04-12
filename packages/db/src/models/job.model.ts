import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String },
    requirements: { type: [String], required: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

// To avoid over-writing models in hot-reloads
export const Job = models.Job || model("Job", jobSchema);
