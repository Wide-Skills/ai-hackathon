import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const jobSaveMock = vi.fn();
const applicantSaveMock = vi.fn();
const jobFindByIdMock = vi.fn();
const jobFindByIdAndUpdateMock = vi.fn();

const Job = Object.assign(
  vi.fn(function Job(this: any, input: any) {
    Object.assign(this, input);
    this.save = jobSaveMock.mockResolvedValue(this);
    this.toObject = () => this;
  }),
  {
    findById: jobFindByIdMock,
    findByIdAndUpdate: jobFindByIdAndUpdateMock,
  },
);

const Applicant = Object.assign(
  vi.fn(function Applicant(this: any, input: any) {
    Object.assign(this, input);
    this.save = applicantSaveMock.mockResolvedValue(this);
    this.toObject = () => this;
  }),
  {
    countDocuments: vi.fn().mockResolvedValue(0),
    findByIdAndUpdate: vi.fn().mockResolvedValue({}),
  },
);

vi.mock("@ai-hackathon/db", () => ({
  Applicant,
  Job,
  ScreeningResult: {
    findOne: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("@ai-hackathon/env/server", () => ({
  env: {
    DATABASE_URL: "mongodb://localhost:27017/test",
    CORS_ORIGIN: "http://localhost:3000",
    RESEND_API_KEY: "re_test",
  },
}));

vi.mock("@ai-hackathon/auth/email", () => ({
  sendApplicationReceivedEmail: vi.fn().mockResolvedValue({ success: true }),
  sendScreeningCompletedEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    output: {
      applicantId: "test-id",
      jobId: "test-job-id",
      matchScore: 70,
      strengths: [],
      gaps: [],
      recommendation: "Consider",
      summary: "Evaluated",
      skillBreakdown: [],
    },
  }),
  Output: {
    object: vi.fn(),
  },
}));

const { jobRouter } = await import("../src/routers/job.router");
const { applicantRouter } = await import("../src/routers/applicant.router");

describe("public flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows public access to get job by ID", async () => {
    const jobId = new Types.ObjectId().toString();
    jobFindByIdMock.mockResolvedValue({
      _id: jobId,
      title: "Public Role",
      description: "Anyone can see this",
      requirements: ["Requirement 1"],
      skills: ["Skill 1"],
      toObject: function () {
        return this;
      },
    });

    const caller = jobRouter.createCaller({ session: null });
    const result = await caller.getPublicById({ id: jobId });

    expect(result).toBeDefined();
    expect(result?.title).toBe("Public Role");
    expect(jobFindByIdMock).toHaveBeenCalledWith(jobId);
  });

  it("allows public application to a job and triggers auto-screening", async () => {
    const jobId = new Types.ObjectId().toString();
    jobFindByIdMock.mockResolvedValue({
      _id: jobId,
      title: "Public Role",
      requirements: ["Requirement 1"],
      skills: ["Skill 1"],
      toObject: function () {
        return this;
      },
    });

    const caller = applicantRouter.createCaller({ session: null });
    const result = await caller.publicApply({
      jobId,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      resumeText: "My resume content",
      skills: [],
    });

    expect(Applicant).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        jobId,
      }),
    );
    expect(result.id).toBeTruthy();
    expect(result.firstName).toBe("John");
    expect(applicantSaveMock).toHaveBeenCalled();
  });
});
