import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const jobSaveMock = vi.fn();
const applicantSaveMock = vi.fn();
const jobFindByIdMock = vi.fn();
const jobFindByIdAndUpdateMock = vi.fn();
const applicantCountDocumentsMock = vi.fn();

const Job = Object.assign(
  vi.fn(function Job(
    this: Record<string, unknown>,
    input: Record<string, unknown>,
  ) {
    const now = new Date("2026-04-15T00:00:00.000Z");
    Object.assign(this, {
      _id: new Types.ObjectId(),
      type: "Full-time",
      skills: [],
      currency: "USD",
      status: "active",
      applicantsCount: 0,
      screenedCount: 0,
      shortlistedCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    Object.assign(this, input);
    this.save = jobSaveMock.mockResolvedValue(this);
    this.toObject = () => {
      const { save, toObject, ...job } = this;
      return job;
    };
  }),
  {
    findById: jobFindByIdMock,
    findByIdAndUpdate: jobFindByIdAndUpdateMock,
  },
);

const Applicant = Object.assign(
  vi.fn(function Applicant(
    this: Record<string, unknown>,
    input: Record<string, unknown>,
  ) {
    const now = new Date("2026-04-15T00:00:00.000Z");
    Object.assign(this, {
      _id: new Types.ObjectId(),
      status: "pending",
      skills: [],
      languages: [],
      experience: [],
      education: [],
      certifications: [],
      projects: [],
      availability: {},
      socialLinks: {},
      createdAt: now,
      updatedAt: now,
    });
    Object.assign(this, input);
    this.save = applicantSaveMock.mockResolvedValue(this);
    this.toObject = () => {
      const { save, toObject, ...applicant } = this;
      return applicant;
    };
  }),
  {
    countDocuments: applicantCountDocumentsMock,
  },
);

vi.mock("@ai-hackathon/env/server", () => ({
  env: {
    DATABASE_URL: "mongodb://localhost:27017/test",
    CORS_ORIGIN: "http://localhost:3000",
    RESEND_API_KEY: "re_test",
  },
}));

vi.mock("@ai-hackathon/db", () => ({
  Applicant,
  Job,
}));

const { jobRouter } = await import("../src/routers/job.router");
const { applicantRouter } = await import("../src/routers/applicant.router");

const authedContext = {
  session: {
    session: {
      id: "session-1",
      createdAt: new Date("2026-04-15T00:00:00.000Z"),
      updatedAt: new Date("2026-04-15T00:00:00.000Z"),
      userId: "user-1",
      expiresAt: new Date("2026-04-22T00:00:00.000Z"),
      token: "token-1",
    },
    user: {
      id: "user-1",
      name: "Smoke User",
      email: "smoke@example.com",
      emailVerified: true,
      createdAt: new Date("2026-04-15T00:00:00.000Z"),
      updatedAt: new Date("2026-04-15T00:00:00.000Z"),
      image: null,
    },
  },
};

describe("action flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    jobFindByIdMock.mockResolvedValue({
      _id: new Types.ObjectId(),
      title: "Senior Platform Engineer",
      skills: ["TypeScript", "PostgreSQL"],
      requirements: ["7+ years backend engineering"],
    });
    jobFindByIdAndUpdateMock.mockResolvedValue(null);
    applicantCountDocumentsMock
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
  });

  it("rejects protected job listing without a session", async () => {
    const caller = jobRouter.createCaller({ session: null });

    await expect(caller.list({ page: 1, limit: 10 })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("creates jobs linked to the authenticated user", async () => {
    const caller = jobRouter.createCaller(authedContext);

    const result = await caller.create({
      title: "Senior Platform Engineer",
      description: "Own the platform layer",
      requirements: ["7+ years backend engineering"],
      skills: ["TypeScript", "PostgreSQL"],
    });

    expect(Job).toHaveBeenCalledWith(
      expect.objectContaining({
        createdByUserId: "user-1",
      }),
    );
    expect(result.id).toBeTruthy();
    expect(result.title).toBe("Senior Platform Engineer");
  });

  it("creates applicants linked to the authenticated user with generated metadata", async () => {
    const caller = applicantRouter.createCaller(authedContext);

    const result = await caller.create({
      jobId: new Types.ObjectId().toString(),
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
    });

    expect(Applicant).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Ada Lovelace",
      }),
    );
    expect(result.appliedAt).toBeTruthy();
    expect(result.status).toBe("pending");
    expect(result.firstName).toBe("Ada");
  });
});
