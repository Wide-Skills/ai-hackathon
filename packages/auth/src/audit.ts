import { AuditLog, type AuditLogDocument } from "@ai-hackathon/db";

export async function writeAuditLog(entry: AuditLogDocument) {
  try {
    await AuditLog.create(entry);
  } catch (error) {
    console.error("Failed to persist audit log", {
      entry,
      error,
    });
  }
}
