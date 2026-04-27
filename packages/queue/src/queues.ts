import { Queue } from "bullmq";
import { connection } from "./connection";

export const screeningQueue = new Queue("screening", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { age: 86400 }, // keep completed jobs for 24h
    removeOnFail: { age: 604800 }, // keep failed jobs for 7 days
  },
});

export const batchScreeningQueue = new Queue("screening-batch", {
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 86400 },
    removeOnFail: { age: 604800 },
  },
});
