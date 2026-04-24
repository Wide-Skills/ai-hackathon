import { env } from "@ai-hackathon/env/server";
import mongoose from "mongoose";
import { Applicant } from "./models/applicant.model";
import { AuditLog } from "./models/audit-log.model";
import { Account, Session, User, Verification } from "./models/auth.model";
import { Job } from "./models/job.model";
import { ScreeningResult } from "./models/screening.model";

async function reset() {
  console.log("Connecting to database for reset...");
  await mongoose.connect(env.DATABASE_URL);

  const collections = [
    { name: "Applicants", model: Applicant },
    { name: "Jobs", model: Job },
    { name: "Screening Results", model: ScreeningResult },
    { name: "Users", model: User },
    { name: "Sessions", model: Session },
    { name: "Accounts", model: Account },
    { name: "Verifications", model: Verification },
    { name: "Audit Logs", model: AuditLog },
  ];

  console.log("Resetting database...");

  for (const col of collections) {
    try {
      const result = await col.model.deleteMany({});
      console.log(`✓ Deleted ${result.deletedCount} ${col.name}`);
    } catch (error: any) {
      console.error(`✗ Failed to reset ${col.name}:`, error.message);
    }
  }

  console.log("\nDatabase reset complete.");
  await mongoose.disconnect();
}

reset().catch((error) => {
  console.error("Database reset failed:", error);
  process.exit(1);
});
