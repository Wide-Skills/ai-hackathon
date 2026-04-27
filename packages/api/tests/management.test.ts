import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const applicantFindByIdMock = vi.fn();
const applicantFindByIdAndUpdateMock = vi.fn();
const applicantFindByIdAndDeleteMock = vi.fn();
const applicantDeleteManyMock = vi.fn();
const applicantCountDocumentsMock = vi.fn();
const jobFindByIdMock = vi.fn();
const jobFindByIdAndUpdateMock = vi.fn();
const jobFindByIdAndDeleteMock = vi.fn();
const screeningFindOneMock = vi.fn();
const screeningFindOneAndUpdateMock = vi.fn();
const screeningFindByIdMock = vi.fn();
const screeningFindByIdAndDeleteMock = vi.fn();
const screeningDeleteManyMock = vi.fn();
const screeningUpdateManyMock = vi.fn();
const screeningUpdateOneMock = vi.fn();
const screeningSaveMock = vi.fn();

const Applicant = Object.assign(vi.fn(), {
  findById: applicantFindByIdMock,
  findByIdAndUpdate: applicantFindByIdAndUpdateMock,
  findByIdAndDelete: applicantFindByIdAndDeleteMock,
  deleteMany: applicantDeleteManyMock,
  countDocuments: applicantCountDocumentsMock,
});

const Job = Object.assign(vi.fn(), {
  findById: jobFindByIdMock,
  findByIdAndUpdate: jobFindByIdAndUpdateMock,
  findByIdAndDelete: jobFindByIdAndDeleteMock,
});

const ScreeningResult = Object.assign(
  vi.fn(function ScreeningResult(this: any, input: any) {
    Object.assign(this, { _id: new Types.ObjectId(), ...input });
    this.save = screeningSaveMock.mockResolvedValue(this);
    this.toObject = () => this;
  }),
  {
    findOne: screeningFindOneMock,
    findOneAndUpdate: screeningFindOneAndUpdateMock,
    findById: screeningFindByIdMock,
    findByIdAndDelete: screeningFindByIdAndDeleteMock,
    deleteMany: screeningDeleteManyMock,
    updateMany: screeningUpdateManyMock,
    updateOne: screeningUpdateOneMock,
  },
);

vi.mock("@ai-hackathon/env/server", () => ({
  env: {
    DATABASE_URL: "mongodb://localhost:27017/test",
    BETTER_AUTH_SECRET: "secret",
    BETTER_AUTH_URL: "http://localhost:3000",
    CORS_ORIGIN: "http://localhost:3000",
    GEMINI_API_KEY: "key",
    RESEND_API_KEY: "key",
  },
}));

vi.mock("@ai-hackathon/db", () => ({
  Applicant,
  Job,
  ScreeningResult,
  ScreeningCache: { findOne: vi.fn(), create: vi.fn() },
}));

vi.mock("@ai-hackathon/auth/email", () => ({
  sendApplicationReceivedEmail: vi.fn().mockResolvedValue({ success: true }),
  sendScreeningCompletedEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    output: {
      matchScore: 85,
      scoreBreakdown: {
        technicalSkills: 80,
        experience: 80,
        education: 80,
        culturalFit: 80,
      },
      strengths: [],
      gaps: [],
      recommendation: "OK",
      summary: "OK",
      skillBreakdown: [],
      skills: [],
      experience: [],
      education: [],
      languages: [],
      certifications: [],
      projects: [],
    },
  }),
  Output: { object: vi.fn() },
}));

const { applicantRouter } = await import("../src/routers/applicant.router");
const { jobRouter } = await import("../src/routers/job.router");
const { screeningRouter } = await import("../src/routers/screening.router");

const authedContext = {
  session: {
    user: { id: "user-1", email: "user@example.com", name: "User" },
  },
} as any;

const mockApplicantData = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  headline: "Engineer",
  location: "Remote",
  appliedAt: new Date().toISOString(),
  availability: { status: "Available", type: "Full-time" },
  skills: [],
  experience: [],
  education: [],
  languages: [],
  certifications: [],
  projects: [],
};

const mockJobData = {
  title: "Senior Engineer",
  description: "A great role",
  requirements: ["Be great"],
  status: "active",
  autoRejectThreshold: 50,
  needsReviewThreshold: 70,
  version: 1,
};

describe("management operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    applicantCountDocumentsMock.mockResolvedValue(0);
  });

  describe("applicant management", () => {
    it("deletes an applicant and cleans up screenings", async () => {
      applicantFindByIdMock.mockResolvedValue({
        _id: new Types.ObjectId(),
        jobId: new Types.ObjectId(),
        toObject() {
          return this;
        },
      });
      const caller = applicantRouter.createCaller(authedContext);

      const result = await caller.delete({
        id: new Types.ObjectId().toString(),
      });

      expect(applicantFindByIdAndDeleteMock).toHaveBeenCalled();
      expect(screeningDeleteManyMock).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it("updates applicant and marks screening as outdated if resume changes", async () => {
      const id = new Types.ObjectId();
      applicantFindByIdMock.mockResolvedValue({
        ...mockApplicantData,
        _id: id,
        resumeText: "old",
        toObject() {
          return this;
        },
      });
      applicantFindByIdAndUpdateMock.mockResolvedValue({
        ...mockApplicantData,
        _id: id,
        jobId: new Types.ObjectId(),
        toObject() {
          return this;
        },
      });
      const caller = applicantRouter.createCaller(authedContext);

      await caller.update({ id: id.toString(), data: { resumeText: "new" } });

      expect(screeningUpdateOneMock).toHaveBeenCalledWith(
        { applicantId: id.toString() },
        { $set: { isOutdated: true } },
      );
    });
  });

  describe("job management", () => {
    it("deletes a job and performs cascade delete", async () => {
      const id = new Types.ObjectId();
      jobFindByIdMock.mockResolvedValue({
        ...mockJobData,
        _id: id,
        toObject() {
          return this;
        },
      });
      const caller = jobRouter.createCaller(authedContext);

      const result = await caller.delete({ id: id.toString() });

      expect(jobFindByIdAndDeleteMock).toHaveBeenCalledWith(id.toString());
      expect(applicantDeleteManyMock).toHaveBeenCalledWith({
        jobId: id.toString(),
      });
      expect(screeningDeleteManyMock).toHaveBeenCalledWith({
        jobId: id.toString(),
      });
      expect(result.success).toBe(true);
    });

    it("increments version and marks screenings as outdated when requirements change", async () => {
      const id = new Types.ObjectId();
      jobFindByIdMock.mockResolvedValue({
        ...mockJobData,
        _id: id,
        version: 1,
        requirements: ["a"],
        toObject() {
          return this;
        },
      });
      jobFindByIdAndUpdateMock.mockResolvedValue({
        ...mockJobData,
        _id: id,
        version: 2,
        requirements: ["b"],
        toObject() {
          return this;
        },
      });
      const caller = jobRouter.createCaller(authedContext);

      await caller.update({ id: id.toString(), data: { requirements: ["b"] } });

      expect(jobFindByIdAndUpdateMock).toHaveBeenCalledWith(
        id.toString(),
        expect.objectContaining({ version: 2, requirements: ["b"] }),
      );
      expect(screeningUpdateManyMock).toHaveBeenCalledWith(
        { jobId: id.toString() },
        { $set: { isOutdated: true } },
      );
    });
  });

  describe("screening management", () => {
    it("updates feedback and recalculates status", async () => {
      const appId = new Types.ObjectId();
      const jobId = new Types.ObjectId();
      screeningFindOneAndUpdateMock.mockResolvedValue({
        _id: new Types.ObjectId(),
        jobId: jobId,
        applicantId: appId,
        matchScore: 85,
        recommendation: "OK",
        skillBreakdown: [],
        strengths: [],
        gaps: [],
        toObject() {
          return this;
        },
      });
      jobFindByIdMock.mockResolvedValue({
        ...mockJobData,
        _id: jobId,
        autoRejectThreshold: 40,
        needsReviewThreshold: 60,
        toObject() {
          return this;
        },
      });
      const caller = screeningRouter.createCaller(authedContext);

      await caller.updateFeedback({
        applicantId: appId.toString(),
        manualScore: 30,
        recruiterNotes: "Not good",
      });

      expect(applicantFindByIdAndUpdateMock).toHaveBeenCalledWith(
        appId.toString(),
        expect.objectContaining({ status: "rejected" }),
      );
    });
  });
});
