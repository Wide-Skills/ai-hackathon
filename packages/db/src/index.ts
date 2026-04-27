import { env } from "@ai-hackathon/env/server";
import mongoose from "mongoose";

await mongoose
  .connect(env.DATABASE_URL, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

const database = mongoose.connection.db;

if (!database) {
  throw new Error("MongoDB database connection is not initialized.");
}

const mongoClient = mongoose.connection.getClient();
const client = mongoClient.db();

export * from "./models/applicant.model";
export * from "./models/audit-log.model";
export * from "./models/job.model";
export * from "./models/screening.model";
export * from "./models/screening-cache.model";
export * from "./models/task-log.model";

export { client, mongoClient };
