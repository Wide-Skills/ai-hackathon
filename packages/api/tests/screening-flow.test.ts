import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const applicantFindByIdMock = vi.fn();
const applicantFindByIdAndUpdateMock = vi.fn();
const applicantCountDocumentsMock = vi.fn();
const jobFindByIdMock = vi.fn();
const jobFindByIdAndUpdateMock = vi.fn();
const screeningFindOneMock = vi.fn();
const screeningSaveMock = vi.fn();

const Applicant = Object.assign(vi.fn(), {
  findById: applicantFindByIdMock,
  findByIdAndUpdate: applicantFindByIdAndUpdateMock,
  countDocuments: applicantCountDocumentsMock,
});

const Job = Object.assign(vi.fn(), {
  findById: jobFindByIdMock,
  findByIdAndUpdate: jobFindByIdAndUpdateMock,
});

const ScreeningResult = Object.assign(
  vi.fn(function ScreeningResult(
    this: Record<string, unknown>,
    input: Record<string, unknown>,
  ) {
    const now = new Date("2026-04-15T00:00:00.000Z");
    Object.assign(this, {
      _id: new Types.ObjectId(),
      createdAt: now,
      updatedAt: now,
    });
    Object.assign(this, input);
    this.set = (next: Record<string, unknown>) => Object.assign(this, next);
    this.save = screeningSaveMock.mockResolvedValue(this);
    this.toObject = () => {
      const { save, set, toObject, ...screening } = this;
      return screening;
    };
  }),
  {
    findOne: screeningFindOneMock,
  },
);

vi.mock("@ai-hackathon/db", () => ({
  Applicant,
  Job,
  ScreeningResult,
}));

const { screeningRouter } = await import("../src/routers/screening.router");

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

describe("screening flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    applicantFindByIdMock.mockResolvedValue({
      _id: new Types.ObjectId(),
      jobId: "job-1",
      firstName: "Ada",
      lastName: "Lovelace",
      skills: [
        { name: "TypeScript" },
        { name: "PostgreSQL" },
      ],
    });

    jobFindByIdMock.mockResolvedValue({
      _id: new Types.ObjectId(),
      title: "Senior Platform Engineer",
      skills: ["TypeScript", "PostgreSQL", "Docker"],
      requirements: ["Build APIs", "Own platform", "Mentor team"],
    });

    applicantCountDocumentsMock
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    applicantFindByIdAndUpdateMock.mockResolvedValue(null);
    jobFindByIdAndUpdateMock.mockResolvedValue(null);
    screeningFindOneMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        _id: new Types.ObjectId(),
        applicantId: "applicant-1",
        jobId: "job-1",
        matchScore: 80,
        strengths: [
          "Matched requirement: typescript",
          "Matched requirement: postgresql",
        ],
        gaps: ["Missing signal: docker"],
        recommendation: "Recommend",
        summary:
          "Ada aligns with 2 core requirements for Senior Platform Engineer.",
        skillBreakdown: [
          { skill: "typescript", score: 92 },
          { skill: "postgresql", score: 92 },
          { skill: "docker", score: 38 },
        ],
        createdAt: new Date("2026-04-15T00:00:00.000Z"),
        updatedAt: new Date("2026-04-15T00:00:00.000Z"),
        toObject() {
          return this;
        },
      });
  });

  it("creates a screening result and synchronizes applicant and job state", async () => {
    const caller = screeningRouter.createCaller(authedContext);

    const result = await caller.generateMock({
      applicantId: "applicant-1",
      jobId: "job-1",
    });

    expect(ScreeningResult).toHaveBeenCalledWith(
      expect.objectContaining({
        applicantId: "applicant-1",
        jobId: "job-1",
        createdByUserId: "user-1",
      }),
    );
    expect(applicantFindByIdAndUpdateMock).toHaveBeenCalledWith(
      "applicant-1",
      expect.objectContaining({
        status: "screening",
      }),
    );
    expect(jobFindByIdAndUpdateMock).toHaveBeenCalledWith("job-1", {
      applicantsCount: 3,
      screenedCount: 2,
      shortlistedCount: 1,
    });
    expect(result.recommendation).toBe("Recommend");
    expect(result.skillBreakdown).toHaveLength(3);
  });
});
