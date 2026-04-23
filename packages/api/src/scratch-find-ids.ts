import { Applicant, Job } from "@ai-hackathon/db";
import { connect } from "mongoose";
import { env } from "@ai-hackathon/env/server";

async function main() {
  await connect(env.DATABASE_URL);
  const applicant = await Applicant.findOne();
  const job = await Job.findOne();
  console.log(JSON.stringify({ applicantId: applicant?._id, jobId: job?._id }));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
