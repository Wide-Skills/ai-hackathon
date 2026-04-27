import mongoose from "mongoose";

const { Schema } = mongoose;

const taskLogSchema = new Schema(
  {
    taskId: {
      type: String,
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      index: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      index: true,
    },
    type: {
      type: String,
      enum: ["screening", "batch-screening", "extraction", "system"],
      required: true,
      index: true,
    },
    step: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    duration: Number,
  },
  { timestamps: true },
);

export interface TaskLogDocument {
  taskId: string;
  jobId?: mongoose.Types.ObjectId | string;
  applicantId?: mongoose.Types.ObjectId | string;
  type: "screening" | "batch-screening" | "extraction" | "system";
  step: string;
  message: string;
  details?: any;
  status: "info" | "success" | "warning" | "error";
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const TaskLog = mongoose.models.TaskLog
  ? mongoose.model<TaskLogDocument>("TaskLog")
  : mongoose.model<TaskLogDocument>("TaskLog", taskLogSchema);
