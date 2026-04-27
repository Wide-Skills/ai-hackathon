import { env } from "@ai-hackathon/env/server";
import mongoose from "mongoose";

import { Applicant } from "./models/applicant.model";
import { AuditLog } from "./models/audit-log.model";
import { Job } from "./models/job.model";
import { ScreeningResult } from "./models/screening.model";

async function reset() {
  console.log("Connecting to database...");
  await mongoose.connect(env.DATABASE_URL);

  console.log("Resetting database...");

  // ✅ 1. clear your app collections (mongoose models)
  const collections = [
    { name: "Applicants", model: Applicant },
    { name: "Jobs", model: Job },
    { name: "Screening Results", model: ScreeningResult },
    { name: "Audit Logs", model: AuditLog },
  ];

  for (const col of collections) {
    try {
      const result = await (col.model as any).deleteMany({});
      console.log(`✓ Deleted ${result.deletedCount} ${col.name}`);
    } catch (error: any) {
      console.error(`✗ Failed ${col.name}:`, error.message);
    }
  }

  // ✅ 2. clear better auth collections (no mongoose models)
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  const authCollections = ["users", "sessions", "accounts", "verifications"];

  for (const name of authCollections) {
    try {
      await db.collection(name).deleteMany({});
      console.log(`✓ Cleared ${name}`);
    } catch (error: any) {
      console.error(`✗ Failed ${name}:`, error.message);
    }
  }

  console.log("\n✅ Database reset complete.");
  await mongoose.disconnect();
}

reset().catch((err) => {
  console.error("❌ Reset failed:", err);
  process.exit(1);
});
