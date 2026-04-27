import { env } from "@ai-hackathon/env/server";
import { Redis as UpstashRedis } from "@upstash/redis";
import { Redis } from "ioredis";

const host = env.UPSTASH_REDIS_REST_URL.replace("https://", "").replace(
  /\/$/,
  "",
);
const redisTcpUrl = `rediss://:${env.UPSTASH_REDIS_REST_TOKEN}@${host}:6379`;

export const connection = new Redis(redisTcpUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const redis = new UpstashRedis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

connection.on("error", (err) => {
  console.error("[Redis] TCP Connection error:", err);
});

export async function checkRedisHealth() {
  try {
    await connection.ping();
    return true;
  } catch (error) {
    console.error("[Redis] Health check failed:", error);
    return false;
  }
}
