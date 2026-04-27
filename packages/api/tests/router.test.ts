import { describe, expect, it, vi } from "vitest";

vi.mock("@ai-hackathon/env/server", () => ({
  env: {
    DATABASE_URL: "mongodb://localhost:27017/test",
    CORS_ORIGIN: "http://localhost:3000",
    RESEND_API_KEY: "re_test",
    UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test_token",
    BETTER_AUTH_SECRET: "test_secret_at_least_32_characters_long",
    BETTER_AUTH_URL: "http://localhost:3000",
  },
}));

vi.mock("@ai-hackathon/db", () => ({
  Applicant: vi.fn(),
  Job: vi.fn(),
  ScreeningResult: vi.fn(),
  TaskLog: { create: vi.fn().mockResolvedValue({}) },
}));

const { appRouter } = await import("../src/routers/index");

describe("AppRouter", () => {
  it("should have jobs router registered", () => {
    expect(appRouter.jobs).toBeDefined();
    expect(appRouter.jobs.create).toBeDefined();
    expect(appRouter.jobs.list).toBeDefined();
    expect(appRouter.jobs.getById).toBeDefined();
  });

  it("should have applicants router registered", () => {
    expect(appRouter.applicants).toBeDefined();
    expect(appRouter.applicants.create).toBeDefined();
    expect(appRouter.applicants.listByJob).toBeDefined();
    expect(appRouter.applicants.getById).toBeDefined();
  });

  it("should have screenings router registered", () => {
    expect(appRouter.screenings).toBeDefined();
    expect(appRouter.screenings.getByApplicant).toBeDefined();
  });
});
