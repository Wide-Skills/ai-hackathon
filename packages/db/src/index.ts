import { env } from "@ai-hackathon/env/server";
import mongoose from "mongoose";

await mongoose.connect(env.DATABASE_URL).catch((error) => {
  console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db("myDB");

export * from "./models/applicant.model";
export * from "./models/auth.model";
export * from "./models/job.model";
export * from "./models/screening.model";

export { client };
