import { describe, expect, it } from "vitest";
import { appRouter } from "../src/routers/index";

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
    expect(appRouter.screenings.generateMock).toBeDefined();
    expect(appRouter.screenings.getByApplicant).toBeDefined();
  });
});
