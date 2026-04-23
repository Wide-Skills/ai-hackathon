import mongoose from "mongoose";

const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    level: {
      type: String,
      enum: ["trace", "debug", "info", "warn", "error", "fatal"],
      default: "info",
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      required: true,
      default: "server",
      index: true,
    },
    status: {
      type: String,
      enum: ["success", "failure", "pending"],
      default: "success",
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    actorUserId: {
      type: String,
      ref: "User",
      index: true,
    },
    actorEmail: {
      type: String,
      index: true,
    },
    requestId: {
      type: String,
      index: true,
    },
    ipAddress: String,
    userAgent: String,
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export interface AuditLogDocument {
  level?: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  action: string;
  source: string;
  status?: "success" | "failure" | "pending";
  message: string;
  actorUserId?: string;
  actorEmail?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const AuditLog = mongoose.models.AuditLog
  ? mongoose.model<AuditLogDocument>("AuditLog")
  : mongoose.model<AuditLogDocument>("AuditLog", auditLogSchema);
